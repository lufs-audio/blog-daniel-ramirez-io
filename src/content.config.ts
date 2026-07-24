import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { POST_FORMATS, FORMAT_FIELDS } from './lib/formats';

/**
 * The content collections ARE the registry (filesystem-as-registry): the tree
 * under src/content/ is the source of truth, each file is a self-describing
 * unit, and these Zod schemas are the contract. `astro build` fails closed on a
 * post whose frontmatter violates the schema — the verification gate the old
 * Hugo flow never had.
 *
 * The tree mirrors the Obsidian vault so the sync pipeline stays 1:1
 * (rsync Obsidian/hugo-content -> src/content). See sync_obsidian-to-astro.sh.
 *
 * ── format registry ────────────────────────────────────────────────────────
 * `format` is one more typed field on the manifest. It selects the presentation
 * layer (chrome + affordances) without changing the fact that a post is markdown.
 * Default is 'standard' so every existing post renders untouched. A typo in the
 * enum fails the build — the same gate we trust everywhere else. All per-format
 * fields below are OPTIONAL: authoring stays "write markdown + fill a few
 * frontmatter fields," never "learn a new markup language."  See FORMATS.md.
 *
 * The enum values live once in src/lib/formats.ts (imported here and by
 * PostLayout) so the list can't drift across files.
 */

// The blog. This schema is the contract Amacher's frontend reads — nothing else.
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z
    .object({
    title: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    series: z.string().optional(),

    // ── presentation axis (kept separate from `tags`, the topical axis) ──
    format: z.enum(POST_FORMATS).default('standard'),
    // Optional standfirst / deck shown under the title on non-standard formats.
    dek: z.string().optional(),

    // format: build — a maker post. All optional; absence just omits the module.
    repo: z.string().url().optional(),
    stack: z.array(z.string()).default([]),
    tldr: z.string().optional(),

    // format: dispatch — a news→opinion piece.
    kicker: z.string().optional(),          // e.g. "Stream 02 — AI & Music"
    sources: z
      .array(z.object({ title: z.string(), url: z.string().url(), meta: z.string().optional() }))
      .default([]),

    // format: review — verdict-led. `illustrative` prints a "demo copy" banner.
    score: z.number().min(0).max(10).optional(),
    verdict: z.string().optional(),
    pros: z.array(z.string()).default([]),
    cons: z.array(z.string()).default([]),
    specs: z.array(z.object({ k: z.string(), v: z.string() })).default([]),
    illustrative: z.boolean().default(false),
    })
    // Fail closed on cross-format field misuse: a `standard` post that sets
    // `score` (or any other format-owned field) is almost certainly a mistake —
    // catch it at build time rather than ship it silently. The per-format
    // ownership map lives once in src/lib/formats.ts (FORMAT_FIELDS) and now
    // DRIVES both this guard and the new-post scaffolder, so the two can never
    // drift. (Guard staged by Ciani; map-wired here by Amacher, ratifying the seam.)
    .superRefine((d, ctx) => {
      const rec = d as Record<string, unknown>;
      for (const [owner, fields] of Object.entries(FORMAT_FIELDS)) {
        if (d.format === owner) continue; // this format legitimately owns these
        for (const f of fields) {
          const v = rec[f];
          const isSet = Array.isArray(v) ? v.length > 0 : v !== undefined && v !== false;
          if (isSet)
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [f],
              message: `\`${f}\` is only valid on format: ${owner} (this post is format: ${d.format})`,
            });
        }
      }
    }),
});

// The /resources/ section (Books, Music, People, ...).
const resources = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/resources' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
    description: z.string().optional(),
  }),
});

// Standalone pages (about, resume) that live in their own Hugo-style sections.
// Kept in one collection so the mirrored content tree round-trips through rsync.
const pages = defineCollection({
  loader: glob({
    base: './src/content',
    pattern: ['about/**/*.md', 'resume/**/*.md', 'utilities/**/*.md'],
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    description: z.string().optional(),
  }),
});

export const collections = { posts, resources, pages };
