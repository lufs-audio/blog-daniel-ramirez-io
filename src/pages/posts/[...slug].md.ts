import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { hugoSlug } from '../../lib/slug';

/**
 * /posts/<slug>.md — each post's raw markdown as a standalone file.
 *
 * WHY: the "view source" reader used to inline the full markdown in a hidden
 * <pre> on every post page, which meant the body text shipped TWICE — measured at
 * 31.6% of post HTML on the largest post. Every visitor paid that weight for an
 * affordance only some of them open. The drawer now fetches this on demand.
 *
 * Bonus: a clean, plain-text source file per post is a genuinely good citable
 * artifact for answer engines — the same reason /llms.txt exists.
 *
 * The `.md` sits alongside the pretty URL: /posts/my-post/ -> /posts/my-post.md.
 */
export async function getStaticPaths() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: hugoSlug(post.data.title) },
    props: { post },
  }));
}

export async function GET({ props }: APIContext) {
  const { post } = props as { post: { body: string } };
  return new Response(post.body ?? '', {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      // Immutable-ish: the source only changes when the post does, and the post
      // URL changes with its title. Safe to cache hard.
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
