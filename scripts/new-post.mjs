#!/usr/bin/env node
/**
 * new-post — the blog draft-init scaffolder for blog-daniel-ramirez-io.
 *
 * Writes a fresh post .md into the Obsidian vault (the source of truth) with
 * ONLY honored frontmatter pre-filled and `draft: true` by default, so nothing
 * can publish by accident and nothing un-honored can be written. It then flows
 * through the existing sync_obsidian-to-astro.sh rsync untouched.
 *
 * Single source of truth, borrowed not reinvented:
 *   - the valid formats + their owned fields  ← src/lib/formats.ts   (Amacher)
 *   - title → URL slug                         ← src/lib/slug.ts      (SSOT)
 *   - the vault path                           ← blog.env / $BLOG_SOURCE
 *
 * Two ways to drive it (Oliveros's automation uses the second):
 *   1. interactive   npm run new-post
 *   2. flag / JSON   npm run new-post -- --title "…" --format build --json
 *
 * Fail-closed: unknown format, missing title, a filename that already exists, or
 * a title whose URL slug collides with an existing post all abort with a nonzero
 * exit (override a collision only with --force). Run via `npm run new-post`
 * (passes Node's type-strip flag so the .ts imports resolve on Node 22.6+).
 *
 * ⚠️  The emitted TEMPLATE SHAPE (which stubs, example values, field order) is
 *     Amacher's lane. This is a first cut derived from FORMATS.md; adjust freely.
 *
 * @author Ciani
 */
import { parseArgs } from 'node:util';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { POST_FORMATS, FORMAT_FIELDS, SHARED_OPTIONAL_FIELDS } from '../src/lib/formats.ts';
import { hugoSlug } from '../src/lib/slug.ts';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/** A thrown UserError is a clean, expected failure (bad input) — not a bug. */
class UserError extends Error {}

// ── config: one place the vault path lives (blog.env), env var wins ──────────
/** Parse a plain KEY=VALUE dotenv file (no shell expansion). Bash + Node read
 *  it identically. Surrounding quotes on a value are stripped. */
export function parseEnvFile(text) {
  const out = {};
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

/** Resolve the vault path: $BLOG_SOURCE env override first, then blog.env. */
export function resolveBlogSource({ env = process.env, root = REPO_ROOT } = {}) {
  if (env.BLOG_SOURCE && env.BLOG_SOURCE.trim()) return env.BLOG_SOURCE.trim();
  const envFile = join(root, 'blog.env');
  if (existsSync(envFile)) {
    const parsed = parseEnvFile(readFileSync(envFile, 'utf8'));
    if (parsed.BLOG_SOURCE && parsed.BLOG_SOURCE.trim()) return parsed.BLOG_SOURCE.trim();
  }
  throw new UserError(
    'BLOG_SOURCE is not set. Add it to blog.env or export BLOG_SOURCE=<vault path>.',
  );
}

// ── pure helpers ─────────────────────────────────────────────────────────────
/** Obsidian-style filename: keep the title's spaces and case, replace only the
 *  characters a filesystem/Obsidian forbids (matches the existing vault, e.g.
 *  "Protecting Your Sound: …" → "Protecting Your Sound_ ….md"). */
export function toFilename(title) {
  const clean = title
    .replace(/[\/\\:*?"<>|]/g, '_') // FS/Obsidian-illegal → underscore
    .replace(/\s+/g, ' ')
    .replace(/\.+$/, '') // no trailing dots
    .trim();
  if (!clean) throw new UserError('Title reduces to an empty filename.');
  return `${clean}.md`;
}

export function normalizeFormat(input) {
  const fmt = (input ?? 'standard').trim();
  if (!POST_FORMATS.includes(fmt)) {
    throw new UserError(
      `Unknown format "${fmt}". Valid formats: ${POST_FORMATS.join(', ')}.`,
    );
  }
  return fmt;
}

export function todayLocalISO(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function normalizeDate(input) {
  if (!input) return todayLocalISO();
  const s = input.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    throw new UserError(`Date "${s}" is not YYYY-MM-DD.`);
  }
  const dt = new Date(`${s}T00:00:00`);
  if (Number.isNaN(dt.getTime()) || todayLocalISO(dt) !== s) {
    throw new UserError(`Date "${s}" is not a real calendar date.`);
  }
  return s;
}

export function parseTags(input) {
  if (!input) return [];
  const arr = Array.isArray(input) ? input : String(input).split(',');
  return [...new Set(arr.map((t) => t.trim()).filter(Boolean))];
}

/** YAML double-quoted scalar. JSON.stringify output is a valid YAML flow scalar. */
const yq = (s) => JSON.stringify(String(s ?? ''));

// Example stub values, one per optional field, sourced from FORMATS.md. These
// render COMMENTED, so the schema never sees them until the author opts in.
const FIELD_STUBS = {
  repo: 'repo: https://github.com/danialrami/your-repo',
  stack: 'stack: [Python, Bash]',
  tldr: 'tldr: One-line what-and-why.',
  sources: 'sources:\n#   - { title: "Source title", url: "https://…", meta: "2026-01-01" }',
  score: 'score: 8.2',
  verdict: 'verdict: One-line, quotable verdict.',
  pros: 'pros: ["The good thing"]',
  cons: 'cons: ["The caveat"]',
  specs: 'specs:\n#   - { k: "Spec", v: "Value" }',
  illustrative: 'illustrative: true   # prints a "demo copy" banner; drop for a real review',
  dek: 'dek: Standfirst shown under the title on non-standard formats.',
  kicker: 'kicker: Stream 02 — AI & Music',
  series: 'series: Series name',
};

/** Build the post file body (frontmatter + starter). Pure. */
export function buildPost({ title, format, date, description = '', tags = [] }) {
  const fmt = normalizeFormat(format);
  const t = String(title ?? '').trim();
  if (!t) throw new UserError('Title is required.');

  const lines = [
    '---',
    `title: ${yq(t)}`,
    `date: ${normalizeDate(date)}`,
    'draft: true',
    `description: ${yq(description)}`,
    `tags: [${parseTags(tags).map(yq).join(', ')}]`,
    `format: ${fmt}`,
  ];

  // Commented optional stubs: this format's owned fields, then the shared ones.
  const owned = FORMAT_FIELDS[fmt] ?? [];
  const shared = fmt === 'standard' ? [] : SHARED_OPTIONAL_FIELDS;
  const stubFields = [...owned, ...shared];
  if (stubFields.length) {
    lines.push(`# ── optional (${fmt}) — uncomment what you use ──`);
    for (const f of stubFields) {
      const stub = FIELD_STUBS[f] ?? `${f}:`;
      for (const sl of stub.split('\n')) lines.push(sl.startsWith('#') ? sl : `# ${sl}`);
    }
  }

  lines.push('---', '');
  lines.push('<!-- Scaffolded by scripts/new-post.mjs — draft:true until you flip it. -->');
  lines.push('');
  return lines.join('\n');
}

/** Scan a posts dir for a title whose slug collides with `slug`. Pure-ish (fs read). */
export function findSlugCollision(dir, slug, exceptFile) {
  if (!existsSync(dir)) return null;
  for (const name of readdirSync(dir)) {
    if (!name.endsWith('.md') || name === exceptFile) continue;
    let fm = '';
    try {
      const text = readFileSync(join(dir, name), 'utf8');
      const m = text.match(/^---\s*\n([\s\S]*?)\n---/);
      fm = m ? m[1] : '';
    } catch {
      continue;
    }
    const titleM = fm.match(/^title:\s*(.+?)\s*$/m);
    if (!titleM) continue;
    let existingTitle = titleM[1].trim();
    if (
      (existingTitle.startsWith('"') && existingTitle.endsWith('"')) ||
      (existingTitle.startsWith("'") && existingTitle.endsWith("'"))
    ) {
      existingTitle = existingTitle.slice(1, -1);
    }
    if (hugoSlug(existingTitle) === slug) return name;
  }
  return null;
}

// ── CLI ───────────────────────────────────────────────────────────────────────
const USAGE = `new-post — scaffold a draft blog post into the Obsidian vault.

Usage:
  npm run new-post                                  # interactive
  npm run new-post -- --title "My Post" [options]   # flag-driven
  npm run new-post -- --title "My Post" --json      # machine output (automation)

Options:
  --title, -t <str>        Post title (required non-interactively)
  --format, -f <name>      One of: ${POST_FORMATS.join(', ')} (default: standard)
  --date <YYYY-MM-DD>      Publish date (default: today, local)
  --description <str>      Short description
  --tags <a,b,c>           Comma-separated tags
  --dir <path>             Output dir (default: $BLOG_SOURCE/posts)
  --force                  Overwrite an existing file / slug collision
  --dry-run, --stdout      Print the file instead of writing it
  --json                   Emit JSON (implies non-interactive); errors as JSON too
  --help, -h               This help

Everything writes draft:true. The vault path comes from blog.env (or $BLOG_SOURCE).`;

function parseCli(argv) {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      title: { type: 'string', short: 't' },
      format: { type: 'string', short: 'f' },
      date: { type: 'string' },
      description: { type: 'string' },
      tags: { type: 'string' },
      dir: { type: 'string' },
      force: { type: 'boolean', default: false },
      'dry-run': { type: 'boolean', default: false },
      stdout: { type: 'boolean', default: false },
      json: { type: 'boolean', default: false },
      help: { type: 'boolean', short: 'h', default: false },
    },
  });
  if (!values.title && positionals.length) values.title = positionals.join(' ');
  return values;
}

async function promptInteractive(v) {
  const rl = createInterface({ input: stdin, output: stdout });
  try {
    if (!v.title) {
      v.title = (await rl.question('Title: ')).trim();
      if (!v.title) throw new UserError('Title is required.');
    }
    if (!v.format) {
      const def = 'standard';
      const ans = (await rl.question(`Format [${POST_FORMATS.join('/')}] (${def}): `)).trim();
      v.format = ans || def;
    }
    normalizeFormat(v.format); // fail early, still interactive
    if (v.description === undefined) {
      v.description = (await rl.question('Description (optional): ')).trim();
    }
    if (v.tags === undefined) {
      v.tags = (await rl.question('Tags, comma-separated (optional): ')).trim();
    }
  } finally {
    rl.close();
  }
  return v;
}

export async function run(argv, { env = process.env, isTTY = stdin.isTTY } = {}) {
  const v = parseCli(argv);
  if (v.help) return { help: true, text: USAGE };

  const nonInteractive = v.json || !isTTY;
  if (!nonInteractive) await promptInteractive(v);
  if (!v.title || !v.title.trim()) throw new UserError('Title is required (pass --title).');

  const title = v.title.trim();
  const format = normalizeFormat(v.format);
  const date = normalizeDate(v.date);
  const content = buildPost({ title, format, date, description: v.description, tags: v.tags });

  const slug = hugoSlug(title);
  if (!slug) throw new UserError(`Title \"${title}\" produces an empty URL slug — it needs letters or numbers.`);
  const filename = toFilename(title);
  const outDir = v.dir ? resolve(v.dir) : join(resolveBlogSource({ env }), 'posts');
  const path = join(outDir, filename);
  const url = `/posts/${slug}/`;
  const dryRun = v['dry-run'] || v.stdout;

  const result = { path, filename, slug, url, format, draft: true, wrote: false, content };

  if (dryRun) return result;

  // fail-closed guards
  if (existsSync(path) && !v.force) {
    throw new UserError(`Refusing to overwrite existing file: ${path} (use --force).`);
  }
  const collision = findSlugCollision(outDir, slug, filename);
  if (collision && !v.force) {
    throw new UserError(
      `URL slug "${slug}" already used by "${collision}" — two posts would share ${url}. ` +
        `Rename, or use --force if intentional.`,
    );
  }

  mkdirSync(outDir, { recursive: true });
  writeFileSync(path, content, { encoding: 'utf8', flag: v.force ? 'w' : 'wx' });
  result.wrote = true;
  return result;
}

async function main() {
  const json = process.argv.includes('--json');
  try {
    const r = await run(process.argv.slice(2));
    if (r.help) {
      stdout.write(r.text + '\n');
      return;
    }
    if (json) {
      stdout.write(JSON.stringify(r) + '\n');
      return;
    }
    if (!r.wrote) {
      stdout.write(r.content);
      stdout.write(`\n# (dry-run) would write → ${r.path}\n# URL → ${r.url}\n`);
      return;
    }
    stdout.write(
      `✓ Draft created (draft: true)\n` +
        `  file : ${r.path}\n` +
        `  url  : ${r.url}\n` +
        `  edit in Obsidian, then run ./sync_obsidian-to-astro.sh to publish.\n`,
    );
  } catch (err) {
    const msg = err instanceof UserError ? err.message : `Unexpected error: ${err?.stack || err}`;
    if (json) {
      stdout.write(JSON.stringify({ error: msg }) + '\n');
    } else {
      process.stderr.write(`✗ ${msg}\n`);
    }
    process.exitCode = 1;
  }
}

// Only run as a CLI when invoked directly (so the test can import the helpers).
if (process.argv[1] && import.meta.filename === resolve(process.argv[1])) {
  await main();
}
