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
