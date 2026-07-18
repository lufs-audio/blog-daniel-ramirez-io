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
  menu: MenuItem[];
  socials: SocialLink[];
  /** RSS feed lives at /posts/index.xml to preserve the old Hugo feed URL. */
  feedUrl: string;
}

// The family cloud mark (same as resume.daniel-ramirez.io), inlined as an SVG
// data URI so there's no binary to ship — fully portable. Used for BOTH the
// favicon and the sidebar avatar (dark disc + cream cloud), which kills the old
// /images/fbf9e2_cloud-profile.png 404. Personal register.
const CLOUD_MARK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23201e1b'/%3E%3Cpath d='M100,30 C130,30 150,50 150,80 C180,80 200,100 200,130 C200,160 180,180 150,180 L50,180 C20,180 0,160 0,130 C0,100 20,80 50,80 C50,50 70,30 100,30 Z' fill='%23e8e4d4'/%3E%3Ccircle cx='70' cy='100' r='15' fill='%23201e1b'/%3E%3Ccircle cx='130' cy='100' r='15' fill='%23201e1b'/%3E%3C/svg%3E";

export const site: SiteConfig = {
  brand: 'Daniel Ramirez',
  description: 'Sound & Systems',
  brandImage: CLOUD_MARK,
  favicon: CLOUD_MARK,
  canonicalUrl: 'https://blog.daniel-ramirez.io',
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
