import fs from 'node:fs';
import path from 'node:path';
import { getSortedMixes } from '../utils/mixes.js';

function generateSiteMap(mixes) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>https://hbbj.holiday</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>daily</changefreq>
       <priority>1.0</priority>
     </url>
     ${mixes
       .map(({ slug, frontmatter }) => {
         return `
       <url>
           <loc>${`https://hbbj.holiday/mix/${slug}`}</loc>
           <lastmod>${new Date(frontmatter.date).toISOString()}</lastmod>
           <changefreq>monthly</changefreq>
           <priority>0.8</priority>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

async function generateSitemap() {
  try {
    const mixes = await getSortedMixes();
    const sitemap = generateSiteMap(mixes);
    const publicPath = path.join(process.cwd(), 'public', 'sitemap.xml');

    fs.writeFileSync(publicPath, sitemap, 'utf8');

    if (process.env.NODE_ENV !== 'production') {
      console.log('✓ Sitemap generated successfully at public/sitemap.xml');
    }
  } catch (err) {
    console.error('Error generating sitemap:', err);
    process.exit(1);
  }
}

generateSitemap();
