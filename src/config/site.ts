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

export interface SiteConfig {
  brand: string;
  description: string;
  /** Brand image shown in the sidebar; served from /public. */
  brandImage: string;
  favicon: string;
  canonicalUrl: string;
  /** Byline for meta[name=author], article:author, and JSON-LD attribution. */
  author: string;
  /** The canonical identity hub the byline points at (not this blog). */
  authorUrl: string;
  /**
   * Social card for og:image / twitter:image; served from /public.
   * Currently the square profile mark. A proper 1200x630 landscape card is built
   * (scripts/og-card.html) but must be committed as real binary — see README.
   */
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
  canonicalUrl: 'https://blog.daniel-ramirez.io',
  author: 'Daniel Ramirez',
  // The identity hub, not the blog — so attribution consolidates on one entity.
  authorUrl: 'https://daniel-ramirez.io',
  // Square 2250x2250 profile mark. Renders as a large square card rather than a
  // 1.91:1 banner; swap to '/images/og-card.png' (1200x630) once that binary lands.
  ogImage: '/images/fbf9e2_cloud-profile.png',
  ogImageWidth: 2250,
  ogImageHeight: 2250,
  menu: [
    { name: 'About', url: '/about/' },
    { name: 'Posts', url: '/posts/' },
    { name: 'Resources', url: '/resources/' },
    { name: 'Resume', url: 'https://lufs-dev.exe.xyz/', external: true },
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
