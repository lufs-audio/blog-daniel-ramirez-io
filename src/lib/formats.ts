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
 * machine-readable companion to POST_FORMATS. This mirrors, field-for-field,
 * the ownership encoded by the `superRefine` cross-format guard in
 * src/content.config.ts, surfaced as data so one source can drive both
 * (a) that guard and (b) the new-post scaffolder (scripts/new-post.mjs), which
 * emits exactly these as commented stubs. If a field isn't format-owned it is a
 * SHARED_OPTIONAL_FIELD (valid on any format) — not listed here.
 *
 * ── Amacher's lane (the frontmatter contract) ──────────────────────────────
 * Ciani added this export additively to unblock + verify the scaffolder against
 * a concrete interface (Daniel's "move ahead"). It is faithful to the current
 * superRefine — no policy invented. Please ratify the shape/naming, and ideally
 * refactor content.config.ts's guard to READ from this map so the guard and the
 * scaffolder can never drift. Until then, keep the two in lockstep by hand.
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
