#!/bin/bash
# Obsidian -> Astro content sync. Adapted from the original Hugo pipeline
# (itself adapted from NetworkChuck: https://blog.networkchuck.com/posts/my-insane-blog-pipeline/).
#
# WHAT'S PRESERVED (the authoring half, unchanged):
#   - You keep writing posts in the Obsidian vault.
#   - rsync copies the vault's content tree into the site.
#   - media.py rewrites Obsidian ![[embeds]] into portable Markdown/HTML and
#     copies the referenced media out of the vault's attachments folder.
#
# WHAT CHANGED vs. the Hugo script:
#   - rsync destination is now src/content/ (Astro content collections).
#   - media.py writes into public/ (Astro serves public/ at the site root, so the
#     emitted /images/... URLs are unchanged).
#   - NO local build and NO `git subtree ... --force` to a host branch. This script
#     stops at `git push origin main`. CI builds the verified artifact and publishes
#     it to the agnostic `site` branch. (See scripts/build + the KB
#     website-portability suite.)
#   - The vault path now lives in blog.env (shared with scripts/new-post.mjs) so
#     there's ONE config. A pre-set BLOG_SOURCE env var still overrides it.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# The Obsidian vault content folder (source of truth). One config: blog.env.
# Precedence: an already-exported BLOG_SOURCE wins; otherwise blog.env supplies it.
_preset_blog_source="${BLOG_SOURCE:-}"
if [ -f "$SCRIPT_DIR/blog.env" ]; then
  set -a
  # shellcheck source=/dev/null
  . "$SCRIPT_DIR/blog.env"
  set +a
fi
[ -n "$_preset_blog_source" ] && BLOG_SOURCE="$_preset_blog_source"
sourcePath="${BLOG_SOURCE:?BLOG_SOURCE is not set — cp blog.env.example blog.env and set it (or export BLOG_SOURCE)}"
# Astro content collection root (mirrors the vault tree: posts/, about/, resources/, ...).
destinationPath="$SCRIPT_DIR/src/content"

for cmd in git rsync python3; do
  command -v "$cmd" >/dev/null 2>&1 || { echo "$cmd is not installed or not in PATH."; exit 1; }
done

[ -d "$sourcePath" ] || { echo "Source path does not exist: $sourcePath"; exit 1; }
mkdir -p "$destinationPath"

echo "Syncing content from Obsidian..."
rsync -av --delete \
  --exclude '.DS_Store' \
  "$sourcePath/" "$destinationPath/"

echo "Processing media links..."
python3 media.py

echo "Committing source..."
git add -A
if git diff --cached --quiet; then
  echo "No changes to commit."
else
  git commit -m "New post on $(date +'%Y-%m-%d %H:%M:%S')"
fi

echo "Pushing to main (CI builds + publishes the verified artifact to the site branch)..."
git push origin main

echo "Done. CI takes it from here."
