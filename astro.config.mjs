// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Canonical site URL. Also declared in site.yaml (single source for the deploy contract).
// The blog serves at blog.daniel-ramirez.io; this replaces the old hardcoded danialrami.com baseURL.
export default defineConfig({
  site: 'https://blog.daniel-ramirez.io',
  // Preserve Hugo's pretty-URL shape: /posts/<slug>/ with a trailing slash.
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap()],
  markdown: {
    // Raw HTML in Markdown must pass through untouched: media.py injects <audio>/<video>
    // players and some posts embed <iframe>. This mirrors Hugo's goldmark unsafe = true.
    // (Astro renders raw HTML in .md by default; GFM — tables, footnotes — is on by default.)
  },
});
