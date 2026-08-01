import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    /** <title> and H1. Keep the primary keyword near the front. */
    title: z.string(),
    /** Meta description. ~150–160 chars. */
    description: z.string(),
    /** Short label for the card grid, e.g. "3 days / week". */
    daysLabel: z.string(),
    /** Card heading: shorter than the full title. */
    cardTitle: z.string(),
    /** Card body copy. */
    blurb: z.string(),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    /** Controls ordering in the guide grid and blog index. */
    order: z.number().default(50),
    /** Rendered as an FAQPage schema block at the foot of the article. */
    faq: z
      .array(z.object({ q: z.string(), a: z.string() }))
      .default([]),
  }),
});

export const collections = { guides };
