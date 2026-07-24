/**
 * Self-test for the new-post scaffolder. Practices what the product preaches:
 * we prove the scaffolder emits schema-honored frontmatter and fails closed,
 * rather than trusting it exited 0. Run: npm run test:new-post
 *
 * These checks mirror the gates in src/content.config.ts (the Zod schema +
 * superRefine cross-format guard) without importing astro:content, so they run
 * as a plain Node test.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  buildPost,
  toFilename,
  normalizeFormat,
  normalizeDate,
  parseTags,
  parseEnvFile,
  findSlugCollision,
  resolveBlogSource,
  run,
} from './new-post.mjs';
import { POST_FORMATS, FORMAT_FIELDS } from '../src/lib/formats.ts';
import { hugoSlug } from '../src/lib/slug.ts';

/** Split a scaffolded file into the frontmatter block and parse the UNCOMMENTED
 *  top-level keys — the ones the schema would actually see. */
function honoredKeys(content) {
  const m = content.match(/^---\s*\n([\s\S]*?)\n---/);
  assert.ok(m, 'has a frontmatter block');
  const keys = [];
  for (const line of m[1].split('\n')) {
    if (line.startsWith('#') || line.startsWith(' ')) continue; // comments / nested
    const km = line.match(/^([A-Za-z_][\w-]*):/);
    if (km) keys.push(km[1]);
  }
  return keys;
}

const BASE = new Set(['title', 'date', 'draft', 'description', 'tags', 'format']);

test('every format scaffolds valid, honored, draft frontmatter', () => {
  for (const format of POST_FORMATS) {
    const content = buildPost({ title: `Test ${format}`, format, date: '2026-07-24' });
    const keys = honoredKeys(content);

    // draft:true is the whole point — nothing auto-publishes.
    assert.match(content, /^draft: true$/m, `${format}: draft:true present`);
    // format is emitted and valid.
    assert.match(content, new RegExp(`^format: ${format}$`, 'm'), `${format}: format line`);
    // Only base fields are uncommented — no format-owned field leaks live.
    for (const k of keys) {
      assert.ok(BASE.has(k), `${format}: unexpected live key "${k}"`);
    }
    // The superRefine invariant: no OTHER format's owned field is set live.
    for (const [other, fields] of Object.entries(FORMAT_FIELDS)) {
      if (other === format) continue;
      for (const f of fields) {
        assert.ok(!keys.includes(f), `${format}: leaked ${other} field "${f}"`);
      }
    }
    // This format's owned fields appear, but COMMENTED (opt-in only).
    for (const f of FORMAT_FIELDS[format]) {
      assert.match(content, new RegExp(`^#.*\\b${f}\\b`, 'm'), `${format}: ${f} offered as stub`);
      assert.ok(!keys.includes(f), `${format}: ${f} must be commented, not live`);
    }
  }
});

test('title → filename keeps Obsidian shape; illegal chars sanitized', () => {
  assert.equal(toFilename('FFmpeg and MCP'), 'FFmpeg and MCP.md');
  assert.equal(toFilename('Protecting Your Sound: Audio'), 'Protecting Your Sound_ Audio.md');
  assert.equal(toFilename('a/b\\c:d*e?f"g<h>i|j'), 'a_b_c_d_e_f_g_h_i_j.md');
  assert.throws(() => toFilename('   '), /empty filename/);
});

test('title → URL slug uses the SSOT hugoSlug', () => {
  assert.equal(hugoSlug('FFmpeg and MCP'), 'ffmpeg-and-mcp');
  assert.equal(hugoSlug('MIDI & Audio Recorder'), 'midi-audio-recorder');
});

test('unknown format fails closed', () => {
  assert.throws(() => normalizeFormat('listicle'), /Unknown format/);
  assert.equal(normalizeFormat(undefined), 'standard');
});

test('date validation', () => {
  assert.equal(normalizeDate('2026-07-24'), '2026-07-24');
  assert.throws(() => normalizeDate('2026-13-01'), /not a real calendar date/);
  assert.throws(() => normalizeDate('July 24'), /not YYYY-MM-DD/);
  assert.match(normalizeDate(undefined), /^\d{4}-\d{2}-\d{2}$/);
});

test('tags parse + dedupe', () => {
  assert.deepEqual(parseTags('a, b ,a,,c'), ['a', 'b', 'c']);
  assert.deepEqual(parseTags(''), []);
});

test('dotenv parser strips quotes + comments', () => {
  const p = parseEnvFile('# c\nBLOG_SOURCE="/x/y"\nFOO=bar\n');
  assert.equal(p.BLOG_SOURCE, '/x/y');
  assert.equal(p.FOO, 'bar');
});

test('slug collision is detected', () => {
  const dir = mkdtempSync(join(tmpdir(), 'posts-'));
  writeFileSync(join(dir, 'FFmpeg and MCP.md'), '---\ntitle: FFmpeg and MCP\ndraft: false\n---\n');
  assert.equal(findSlugCollision(dir, 'ffmpeg-and-mcp', 'other.md'), 'FFmpeg and MCP.md');
  assert.equal(findSlugCollision(dir, 'unrelated-slug', 'other.md'), null);
});

test('run() writes draft, then refuses to clobber; --force overwrites', async () => {
  const vault = mkdtempSync(join(tmpdir(), 'vault-'));
  const env = { BLOG_SOURCE: vault };
  const r1 = await run(['--title', 'Hello World', '--json'], { env, isTTY: false });
  assert.equal(r1.wrote, true);
  assert.ok(existsSync(r1.path));
  assert.equal(r1.slug, 'hello-world');
  assert.match(readFileSync(r1.path, 'utf8'), /^draft: true$/m);

  await assert.rejects(run(['--title', 'Hello World', '--json'], { env, isTTY: false }), /overwrite/);
  const r2 = await run(['--title', 'Hello World', '--force', '--json'], { env, isTTY: false });
  assert.equal(r2.wrote, true);
});

test('run() dry-run does not write', async () => {
  const vault = mkdtempSync(join(tmpdir(), 'vault-'));
  const r = await run(['--title', 'Ghost', '--dry-run'], { env: { BLOG_SOURCE: vault }, isTTY: false });
  assert.equal(r.wrote, false);
  assert.ok(!existsSync(r.path));
  assert.match(r.content, /title: "Ghost"/);
});

test('all-punctuation title fails closed (empty URL slug)', async () => {
  await assert.rejects(run(['--title', '///', '--json'], { env: { BLOG_SOURCE: '/tmp' }, isTTY: false }), /empty URL slug/);
});

test('missing title fails closed non-interactively', async () => {
  await assert.rejects(run(['--json'], { env: { BLOG_SOURCE: '/tmp' }, isTTY: false }), /Title is required/);
});
