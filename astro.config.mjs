// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * Workout tables are wide by nature. Wrap every markdown table in a scroll
 * container so the table scrolls inside itself instead of forcing the whole
 * page to scroll sideways on a phone.
 */
function rehypeTableScroll() {
  return (tree) => {
    const visit = (node) => {
      if (!node.children) return;
      node.children = node.children.map((child) => {
        if (child.type === 'element' && child.tagName === 'table') {
          return {
            type: 'element',
            tagName: 'div',
            properties: { className: ['table-scroll'] },
            children: [child],
          };
        }
        visit(child);
        return child;
      });
    };
    visit(tree);
  };
}

export default defineConfig({
  site: 'https://forgefit.fitness',
  trailingSlash: 'never',
  build: {
    // Emit /privacy.html rather than /privacy/index.html so the existing
    // Vercel `cleanUrls` behaviour and all current inbound links keep working.
    format: 'file',
  },
  markdown: {
    rehypePlugins: [rehypeTableScroll],
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/thanks'),
      serialize(item) {
        // The homepage is the acquisition target; guides are the SEO engine.
        if (item.url === 'https://forgefit.fitness/') {
          item.priority = 1.0;
          item.changefreq = 'weekly';
        } else if (item.url.includes('/blog/')) {
          item.priority = 0.8;
          item.changefreq = 'monthly';
        } else if (item.url.includes('/exercises/')) {
          item.priority = 0.6;
          item.changefreq = 'monthly';
        } else {
          item.priority = 0.5;
          item.changefreq = 'monthly';
        }
        return item;
      },
    }),
  ],
});
