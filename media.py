# Obsidian embed -> portable Markdown/HTML rewriter + media copier.
# Adapted from the original Hugo media.py (from NetworkChuck's pipeline), retargeted
# for Astro: media is copied into public/ (served at the site root), and the repo
# root is derived from this file's location instead of being hardcoded.
#
# It walks the synced content tree, rewrites Obsidian embeds ![[file.ext]] into:
#   - images  -> ![Image Description](/images/<file>)         (copied to public/images)
#   - video   -> <video controls>...</video>                   (copied to public/videos)
#   - audio   -> <audio controls>...</audio>                    (copied to public/audio)
# Spaces are URL-encoded to %20 so links resolve. Raw <audio>/<video> render because
# Astro passes raw HTML through in Markdown (astro.config.mjs).

import os
import re
import shutil

REPO_ROOT = os.path.dirname(os.path.abspath(__file__))

# Synced content root (mirrors the Obsidian vault tree).
posts_dir = os.path.join(REPO_ROOT, "src", "content")
# Astro static root: everything here is served at the site root.
static_images_dir = os.path.join(REPO_ROOT, "public", "images")
static_videos_dir = os.path.join(REPO_ROOT, "public", "videos")
static_audio_dir = os.path.join(REPO_ROOT, "public", "audio")
# The Obsidian vault attachments folder (outside the repo). Override with BLOG_ATTACHMENTS.
attachments_dir = os.environ.get(
    "BLOG_ATTACHMENTS", "/Users/danielramirez/Nextcloud/ore/attachments"
)

IMAGE_FORMATS = r"\.(png|jpg|jpeg|gif|webp|svg)"
VIDEO_FORMATS = r"\.(mp4|webm|mov|avi)"
AUDIO_FORMATS = r"\.(mp3|wav|ogg|m4a)"

for directory in [static_images_dir, static_videos_dir, static_audio_dir]:
    os.makedirs(directory, exist_ok=True)

if not os.path.exists(posts_dir):
    raise FileNotFoundError(f"Content directory not found: {posts_dir}")
if not os.path.exists(attachments_dir):
    raise FileNotFoundError(f"Attachments directory not found: {attachments_dir}")

for root, dirs, files in os.walk(posts_dir):
    for filename in files:
        if not filename.endswith(".md"):
            continue
        filepath = os.path.join(root, filename)
        try:
            with open(filepath, "r", encoding="utf-8") as file:
                content = file.read()
        except UnicodeDecodeError:
            print(f"Warning: Encoding issues with {filepath}")
            continue

        media_pattern = rf"!\[\[([^]]*({IMAGE_FORMATS}|{VIDEO_FORMATS}|{AUDIO_FORMATS}))\]\]"
        media_matches = re.findall(media_pattern, content, re.IGNORECASE)

        for media_match in media_matches:
            media_name = media_match[0]  # full filename
            extension = os.path.splitext(media_name)[1].lower()

            if re.match(IMAGE_FORMATS, extension, re.IGNORECASE):
                markdown = f"![Image Description](/images/{media_name.replace(' ', '%20')})"
                target_dir = static_images_dir
            elif re.match(VIDEO_FORMATS, extension, re.IGNORECASE):
                markdown = (
                    f'<video controls controlsList="nodownload" oncontextmenu="return false;">'
                    f'<source src="/videos/{media_name.replace(" ", "%20")}" '
                    f'type="video/{extension[1:]}"></video>'
                )
                target_dir = static_videos_dir
            elif re.match(AUDIO_FORMATS, extension, re.IGNORECASE):
                markdown = (
                    f'<audio controls controlsList="nodownload">'
                    f'<source src="/audio/{media_name.replace(" ", "%20")}" '
                    f'type="audio/{extension[1:]}"></audio>'
                )
                target_dir = static_audio_dir
            else:
                continue

            content = content.replace(f"![[{media_name}]]", markdown)

            media_source = os.path.join(attachments_dir, media_name)
            if os.path.exists(media_source):
                try:
                    shutil.copy(media_source, target_dir)
                except shutil.Error as e:
                    print(f"Error copying {media_name}: {e}")
            else:
                print(f"Warning: Media file not found: {media_name}")

        try:
            with open(filepath, "w", encoding="utf-8") as file:
                file.write(content)
        except Exception as e:
            print(f"Error writing to {filepath}: {e}")

print("Markdown files processed and media files copied successfully.")
