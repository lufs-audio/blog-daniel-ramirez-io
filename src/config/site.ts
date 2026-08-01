/**
 * Site chrome as typed data — the sidebar identity, socials, and nav menu.
 * This replaces the [params] block in the old hugo.toml. Amacher themes the
 * presentation; the data lives here so nothing is buried in a template.
 */

export interface MenuItem {
  name: string;
  url: string;
  external?: boolean;
}

export interface SocialLink {
  label: string;
  url: string;
}

/**
 * The lufs-vh verification mark: ONE file doing two jobs, so the tab icon and the
 * seal at the foot of the page are literally the same image at two sizes. Matches
 * resume.daniel-ramirez.io and daniel-ramirez.io, which ship the identical pattern.
 *
 * The mark is derived from this site's own canonical URL by the lufs-vh CLI and is
 * committed as a static file — there is no build-time or client-side generation:
 *
 *   node cli.ts render "https://blog.daniel-ramirez.io/" \
 *        -S ring-68 -F scope -P dr-muted -o vh-blog-ring.svg
 *
 * sha256 of that exact payload string:
 *   3cd3daeb134c5a578af289eb2828d795951a333ac6be0f40bdf96e41c7a879b6
 * ring-68 carries the first 14 bytes of that digest, so it verifies:
 *   node cli.ts attest <file.png> "https://blog.daniel-ramirez.io/"  -> exit 0
 * and attesting against any OTHER url exits non-zero — which is the whole point:
 * the mark is bound to this site rather than being decoration that looks technical.
 *
 * Render transparent (the tool's default) so the one file composites onto BOTH the
 * charcoal and the cream ground — the stamp needs no theme-conditional CSS.
 *
 * NEVER hand-draw or redraw a substitute. `attest` re-derives the mark from the URL
 * and compares bytes, and that check is the only thing that makes it mean anything.
 * If the canonical URL changes, re-render — never patch.
 *
 * `null` until the mark is rendered and committed to /public: the footer stamp is
 * omitted and the favicon falls back to the cloud data-URI, so the site stays
 * correct rather than shipping a placeholder that would fail attestation.
 */
export interface VisualHash {
  /** Absolute site path to the committed SVG, e.g. '/vh-blog-ring.svg'. */
  mark: string;
  /** Alt/title text; names the site the mark is bound to. */
  alt: string;
}

export interface SiteConfig {
  brand: string;
  description: string;
  /** Brand image shown in the sidebar; served from /public. */
  brandImage: string;
  /** Fallback favicon, used only while `visualHash` is null. */
  favicon: string;
  /**
   * The lufs-vh stamp — footer seal AND favicon. See VisualHash above for how to
   * render it; null means "not rendered yet", not "this site doesn't get one".
   */
  visualHash: VisualHash | null;
  canonicalUrl: string;
  /** Byline for meta[name=author], article:author, and JSON-LD attribution. */
  author: string;
  /** The canonical identity hub the byline points at (not this blog). */
  authorUrl: string;
  /** 1200x630 social card for og:image / twitter:image; source: scripts/og-card.html. */
  ogImage: string;
  /** og:image intrinsic size, declared so unfurlers don't have to fetch to find out. */
  ogImageWidth: number;
  ogImageHeight: number;
  menu: MenuItem[];
  socials: SocialLink[];
  /** RSS feed lives at /posts/index.xml to preserve the old Hugo feed URL. */
  feedUrl: string;
}

// The family cloud mark, inlined as an SVG data URI (no binary) — used for the
// FAVICON. The sidebar AVATAR is the real profile photo binary; commit it to
// public/images/fbf9e2_cloud-profile.png (see the local-agent steps).
const CLOUD_FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23201e1b'/%3E%3Cpath d='M100,30 C130,30 150,50 150,80 C180,80 200,100 200,130 C200,160 180,180 150,180 L50,180 C20,180 0,160 0,130 C0,100 20,80 50,80 C50,50 70,30 100,30 Z' fill='%23e8e4d4'/%3E%3Ccircle cx='70' cy='100' r='15' fill='%23201e1b'/%3E%3Ccircle cx='130' cy='100' r='15' fill='%23201e1b'/%3E%3C/svg%3E";

export const site: SiteConfig = {
  brand: 'Daniel Ramirez',
  description: 'Sound & Systems',
  // Real profile photo (binary lives at public/images/fbf9e2_cloud-profile.png).
  brandImage: '/images/fbf9e2_cloud-profile.png',
  favicon: CLOUD_FAVICON,
  // Flip to { mark: '/vh-blog-ring.svg', alt: 'lufs-vh verification mark for
  // blog.daniel-ramirez.io' } once the rendered SVG is committed to public/.
  // Until then the stamp is omitted and CLOUD_FAVICON stands in — never a redraw.
  visualHash: null,
  canonicalUrl: 'https://blog.daniel-ramirez.io',
  author: 'Daniel Ramirez',
  // The identity hub, not the blog — so attribution consolidates on one entity.
  authorUrl: 'https://daniel-ramirez.io',
  // The 1200x630 landscape social card (source: scripts/og-card.html).
  ogImage: '/images/og-card.png',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  menu: [
    { name: 'About', url: '/about/' },
    { name: 'Posts', url: '/posts/' },
    { name: 'Resources', url: '/resources/' },
    { name: 'Resume', url: 'https://resume.daniel-ramirez.io/', external: true },
    { name: 'Portfolio', url: 'https://portfolio.lufs.audio/', external: true },
    { name: 'Deck', url: 'https://deck.daniel-ramirez.io/', external: true },
  ],
  socials: [
    { label: 'Email', url: 'mailto:daniel@danialrami.com' },
    { label: 'GitHub', url: 'https://github.com/danialrami' },
    { label: 'Instagram', url: 'https://www.instagram.com/danialrami/' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/danialrami/' },
    { label: 'Bluesky', url: 'https://bsky.app/profile/danirami.bsky.social' },
  ],
  feedUrl: '/posts/index.xml',
};
