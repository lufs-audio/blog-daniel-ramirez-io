/**
 * The format registry's single source of truth. Exported once and imported by
 * the content schema (the contract) and PostLayout (the consumer), so the list
 * never drifts across files.
 */
export const POST_FORMATS = [
  'standard', // default · prose article
  'build',    // show-your-work maker post
  'dispatch', // news → opinion
  'analysis', // explainer · music / data analysis
  'review',   // verdict-led
  'freeform', // the escape hatch — bespoke, hand-built
] as const;

export type Format = (typeof POST_FORMATS)[number];

/**
 * Per-format frontmatter fields that ONLY that format may set — the
 * machine-readable companion to POST_FORMATS. If a field isn't format-owned it
 * is a SHARED_OPTIONAL_FIELD (valid on any format) — not listed here.
 *
 * ── Amacher's lane (the frontmatter contract) ──────────────────────────────
 * Ciani staged this export to unblock + verify the scaffolder against a concrete
 * interface (Daniel's "move ahead"). Amacher has RATIFIED it and wired
 * src/content.config.ts's superRefine cross-format guard to READ from this map.
 * FORMAT_FIELDS is now the ONE source of per-format field ownership, driving
 * BOTH that build-time guard and the new-post scaffolder (scripts/new-post.mjs,
 * which emits exactly these as commented stubs) — so the two can never drift.
 * To add/rename a format-owned field: add the Zod field in content.config.ts
 * and its name here; the guard and the scaffolder both follow automatically.
 */
export const FORMAT_FIELDS = {
  standard: [],
  build: ['repo', 'stack', 'tldr'],
  dispatch: ['sources'],
  analysis: [],
  review: ['score', 'verdict', 'pros', 'cons', 'specs', 'illustrative'],
  freeform: [],
} as const satisfies Record<Format, readonly string[]>;

/**
 * Optional fields valid on ANY format (the schema does not guard them). The
 * scaffolder offers these as commented stubs on non-`standard` formats.
 * `title`/`date`/`draft`/`description`/`tags` are always emitted and are not
 * "optional stubs," so they're intentionally absent here.
 */
export const SHARED_OPTIONAL_FIELDS = ['dek', 'kicker', 'series'] as const;
