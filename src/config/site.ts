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

export const site: SiteConfig = {
  brand: 'danialrami',
  description: 'Composer | Sound Designer',
  brandImage: '/images/fbf9e2_cloud-profile.png',
  favicon: '/images/front-idle.gif',
  canonicalUrl: 'https://blog.daniel-ramirez.io',
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
