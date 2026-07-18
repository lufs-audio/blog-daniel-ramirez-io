/**
 * Replicate Hugo's default title-based slugification so every existing URL
 * (/posts/<slug>/) resolves identically after the migration. Hugo lowercases,
 * then replaces every run of non-alphanumeric characters with a single hyphen
 * and trims leading/trailing hyphens.
 *
 * Examples (verified against live URLs):
 *   "FFmpeg and MCP"        -> "ffmpeg-and-mcp"
 *   "MCPs and Merlet"       -> "mcps-and-merlet"
 *   "Lua in REAPER"         -> "lua-in-reaper"
 *   "MIDI & Audio Recorder" -> "midi-audio-recorder"
 *
 * This is the single source of truth for slugs — used by the post routes, the
 * RSS feed, and (later) the URL-parity check in scripts/verify.
 */
export function hugoSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}
