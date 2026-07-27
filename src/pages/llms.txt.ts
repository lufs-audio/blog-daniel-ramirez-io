import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { hugoSlug } from '../lib/slug';
import { site } from '../config/site';

/**
 * /llms.txt — a markdown map of the site for language models (the GEO analogue of
 * robots.txt + sitemap.xml). Follows the llmstxt.org shape: an H1, a blockquote
 * summary, then linked sections.
 *
 * GENERATED from the posts collection rather than hand-maintained, for the same
 * reason the sitemap is: a hand-written index goes stale the first time Daniel
 * publishes and forgets. The collection is the registry; this is a projection of it.
 */
export async function GET(context: APIContext) {
  const origin = new URL('/', context.site ?? site.canonicalUrl).href.replace(/\/$/, '');

  const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  const postLines = posts.map((p) => {
    const url = `${origin}/posts/${hugoSlug(p.data.title)}/`;
    const year = p.data.date.getFullYear();
    // The description is the strongest citation hint we can give; fall back to the
    // date so an un-described post is still disambiguated rather than bare.
    const note = p.data.description?.trim() || `${year} post`;
    return `- [${p.data.title}](${url}): ${note}`;
  });

  const body = `# ${site.brand} — ${site.description}

> Technical writing by ${site.author}: a composer and sound designer turned
> infrastructure engineer. Covers sound design, interactive and game audio, audio
> tooling, networked audio, and the systems built around them. Posts favour concrete
> implementation detail over overview, and cite their sources.

Author: ${site.author} (${site.authorUrl})
Canonical: ${origin}/

## Posts

${postLines.join('\n')}

## Pages

- [About](${origin}/about/): background, current work, and contact
- [Resources](${origin}/resources/): books, music, and people worth knowing about

## Optional

- [RSS feed](${origin}${site.feedUrl}): full-content feed of every post
- [Sitemap](${origin}/sitemap-index.xml)
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
