import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    // one-line positioning under the title
    tagline: z.string(),
    // 'core' projects get full deep pages + top billing; 'secondary' are compact cards
    tier: z.enum(['core', 'secondary']),
    order: z.number(),
    // short label shown in lists (e.g. "code model · LLM")
    kind: z.string(),
    status: z.string(), // e.g. "Active", "Completed", "Research"
    stack: z.array(z.string()).default([]),
    // headline metrics shown as stat chips: { value, label }
    metrics: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
    repo: z.string().optional(),
    link: z.string().optional(), // live site / demo
    // a one-paragraph summary used on the home page
    summary: z.string(),
    // whether to surface on the home page at all
    featured: z.boolean().default(true),
  }),
});

export const collections = { projects };
