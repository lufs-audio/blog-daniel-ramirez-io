import rss from '@astrojs/rss';
import { getCollection, render } from 'astro:content';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { hugoSlug } from '../../lib/slug.ts';
import { site } from '../../config/site.ts';

// Emitted at /posts/index.xml to preserve the old Hugo feed URL (rss_section = "posts").
//
// FULL-CONTENT FEED (Daniel's call, 2026-07-27): subscribers get the whole article in
// their reader, not a teaser plus a click. Each post's markdown is rendered through the
// SAME pipeline the site uses (astro:content `render()` via a container), so the feed
// body can never drift from the page body — one renderer, two outputs.
//
// @astrojs/rss maps `content` to <content:encoded>, which is what readers
// (NetNewsWire, Reeder, Feedly, miniflux) consume. `description` stays the short summary
// so readers that only show a preview line still behave sensibly.
export async function GET(context) {
  const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  const container = await AstroContainer.create();
  const origin = new URL('/', context.site ?? site.canonicalUrl).href;

  const items = [];
  for (const post of posts) {
    const { Content } = await render(post);
    let content = await container.renderToString(Content);

    // A feed reader is not a browser: there's no document base, so root-relative URLs
    // (/images/..., /posts/...) would resolve against the reader's own origin and break.
    // Absolutise src/poster/href against the canonical site.
    content = content
      .replace(/(<(?:img|video|audio|source|iframe)\b[^>]*?\b(?:src|poster)=")\/(?!\/)/g, `$1${origin}`)
      .replace(/(<a\b[^>]*?\bhref=")\/(?!\/)/g, `$1${origin}`);

    items.push({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description ?? '',
      link: `/posts/${hugoSlug(post.data.title)}/`,
      categories: post.data.tags,
      content,
    });
  }

  return rss({
    title: site.brand,
    description: site.description,
    site: context.site,
    items,
    customData: '<language>en-us</language>',
  });
}
