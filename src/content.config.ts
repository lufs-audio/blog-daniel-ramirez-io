import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * The content collections ARE the registry (filesystem-as-registry): the tree
 * under src/content/ is the source of truth, each file is a self-describing
 * unit, and these Zod schemas are the contract. `astro build` fails closed on a
 * post whose frontmatter violates the schema — the verification gate the old
 * Hugo flow never had.
 *
 * The tree mirrors the Obsidian vault so the sync pipeline stays 1:1
 * (rsync Obsidian/hugo-content -> src/content). See sync_obsidian-to-astro.sh.
 */

// The blog. This schema is the contract Amacher's frontend reads — nothing else.
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    series: z.string().optional(),
  }),
});

// The /resources/ section (Books, Music, People, ...).
const resources = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/resources' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
    description: z.string().optional(),
  }),
});

// Standalone pages (about, resume) that live in their own Hugo-style sections.
// Kept in one collection so the mirrored content tree round-trips through rsync.
const pages = defineCollection({
  loader: glob({
    base: './src/content',
    pattern: ['about/**/*.md', 'resume/**/*.md', 'utilities/**/*.md'],
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    description: z.string().optional(),
  }),
});

export const collections = { posts, resources, pages };
