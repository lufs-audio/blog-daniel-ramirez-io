import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { hugoSlug } from '../../lib/slug.ts';
import { site } from '../../config/site.ts';

// Emitted at /posts/index.xml to preserve the old Hugo feed URL (rss_section = "posts").
export async function GET(context) {
  const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
  return rss({
    title: site.brand,
    description: site.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description ?? '',
      link: `/posts/${hugoSlug(post.data.title)}/`,
    })),
  });
}
