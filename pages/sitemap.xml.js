import { getSortedMixes } from "@utils/mixes";

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
       .join("")}
   </urlset>
 `;
}

export async function getServerSideProps({ res }) {
  const mixes = await getSortedMixes();

  const sitemap = generateSiteMap(mixes);

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default function SiteMap() {
  // getServerSideProps will handle the response
  return null;
}
