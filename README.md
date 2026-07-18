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

Override paths with env vars: `BLOG_SOURCE` (vault content), `BLOG_ATTACHMENTS` (vault attachments).

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # -> dist/
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
