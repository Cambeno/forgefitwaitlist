import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const guides = await getCollection('guides');

  return rss({
    title: 'ForgeFit — Training Guides',
    description:
      'Complete workout splits and training programmes — every session, set, rep and progression written out.',
    site: context.site,
    items: guides
      .sort((a, b) => b.data.published.valueOf() - a.data.published.valueOf())
      .map((guide) => ({
        title: guide.data.title,
        description: guide.data.description,
        pubDate: guide.data.published,
        link: `/blog/${guide.id}`,
      })),
    customData: '<language>en-au</language>',
  });
}
