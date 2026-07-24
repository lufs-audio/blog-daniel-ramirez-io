# blog-daniel-ramirez-io

[blog.daniel-ramirez.io](https://blog.daniel-ramirez.io) — Daniel Ramirez's technical blog. Astro static site, owned code (no theme template), LUFS brand. Migrated from the Hugo `poison` template (`danialrami-com`).

This repo is the first **greenfield** implementation of the LUFS website-portability contract. See the plan: `danialrami/agent-knowledge` → `docs/infra/blog-astro-migration/`.

## Authoring workflow (unchanged from the Hugo pipeline)

You write posts in the Obsidian vault; one command syncs them here:

```bash
./sync_obsidian-to-astro.sh
```

That script: `rsync` the vault's content tree into `src/content/`, run `media.py`
(rewrites Obsidian `![[embeds]]` into portable Markdown/HTML + copies media into
`public/`), then `git commit` + `git push origin main`. **The build is not run
locally** — CI builds the verified artifact and publishes it to the `site` branch.

### Config

The vault path lives in **`blog.env`** — the one config shared by both the sync
script and the new-post scaffolder. First-run setup:

```bash
cp blog.env.example blog.env      # then set BLOG_SOURCE to your vault's content dir
```

`blog.env` is gitignored (machine-specific); `blog.env.example` is the committed
template. A pre-set `BLOG_SOURCE` environment variable **overrides** the file
(used by CI / automation / other machines). `BLOG_ATTACHMENTS` (vault attachments,
consumed by `media.py`) is a separate override.

### Creating a new post

`new-post` scaffolds a fresh post into the vault with only *honored* frontmatter
pre-filled and **`draft: true`** — so nothing publishes by accident and you never
hand-type a field the build would reject.

Interactive (prompts for title + format):

```bash
npm run new-post
```

Flag- / JSON-driven (for automation — e.g. Oliveros's drafting cron):

```bash
npm run new-post -- --title "My Post" --format build --tags "audio,mcp" --json
```

- **Formats:** `standard` (default), `build`, `dispatch`, `analysis`, `review`,
  `freeform` — see `FORMATS.md`. The valid list and each format's optional fields
  come from `src/lib/formats.ts` (`POST_FORMATS` / `FORMAT_FIELDS`), the *same*
  source that drives the build-time schema guard — so the scaffolder can never
  offer a field the build would reject.
- **Fail-closed:** unknown format, a missing or empty-slug title, an existing
  file, or a URL-slug collision with another post all abort non-zero (a JSON
  error under `--json`). `--force` overrides a collision; `--dry-run` prints the
  file without writing.
- **Zero-dependency:** pure Node stdlib + native type-stripping (Node ≥ 22.6). No
  `npm install` needed. If `npm` isn't available, call it directly from a repo
  checkout:
  ```bash
  node --experimental-strip-types --disable-warning=ExperimentalWarning \
    scripts/new-post.mjs --title "My Post" --format dispatch --json
  ```
- Then edit the draft in Obsidian and run `./sync_obsidian-to-astro.sh` to publish
  (flip `draft: true` when it's ready).

Options: `--title/-t`, `--format/-f`, `--date`, `--description`, `--tags`, `--dir`,
`--force`, `--dry-run`, `--json`, `--help`. Self-test: `npm run test:new-post`.

## Develop

```bash
npm install
npm run dev            # local dev server
npm run build          # -> dist/
npm run new-post       # scaffold a draft post (see above)
npm run test:new-post  # self-test the scaffolder
```

## Content model

- `src/content/posts/*.md` — blog posts (the `posts` collection).
- `src/content/resources/*.md` — the /resources/ section.
- `src/content/about/`, `src/content/utilities/` — standalone pages (the `pages` collection).
- Schema + collections: `src/content.config.ts`. `astro build` fails closed on invalid frontmatter.
- URLs: `/posts/<slug>/` where `<slug>` is the Hugo title-slug (`src/lib/slug.ts`) — preserves existing links.

## Portability interface (website-portability contract)

- `site.yaml` — the site manifest.
- `scripts/build` · `scripts/verify` · `scripts/package` · `scripts/smoke` — the uniform, host-neutral interface. Run e.g. `bash scripts/build`. (Scripts need the exec bit; `git update-index --chmod=+x scripts/*` after cloning, or invoke via `bash`.)
- `site/{routes.txt,redirects.yaml,headers.yaml,external-origins.yaml}` — provider-neutral routing/headers, translated per host adapter.

## Deploy

CI (to be placed by Daniel — the GitHub App can't commit workflow files) runs
`scripts/build` → `scripts/verify` → `scripts/package`, then publishes the verified
artifact to the agnostic `site` branch. Hostinger git-deploy or Cloudflare Pages
consumes `site` as a swappable adapter. Deploy-target decision is tracked in the KB.

## Frontend

The layouts (`src/layouts/*`), the site chrome data (`src/config/site.ts`), and the
design tokens (`src/styles/tokens.css`) are the seam for the LUFS Brand Design System.
Owned by Amacher; the scaffold ships unstyled with real data flowing.
