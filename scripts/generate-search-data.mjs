import fs from 'node:fs';
import path from 'node:path';
import { getSortedMixes } from '../utils/mixes.mjs';

/**
 * Generate search data from all mixes for client-side search
 */
async function generateSearchData() {
  try {
    const mixes = await getSortedMixes();

    // Extract searchable data from each mix
    const searchData = mixes.map((mix) => ({
      id: mix.slug,
      title: mix.frontmatter.title,
      description: mix.frontmatter.description || '',
      // Include first 500 chars of content for search (avoid huge payloads)
      contentPreview: mix.content ? mix.content.substring(0, 500) : '',
      tracks: mix.playlist
        ? mix.playlist.map((track) => ({
            name: track.name,
            artist: track.singer,
          }))
        : [],
    }));

    // Write to public directory so it's accessible at /search-data.json
    const outputPath = path.join(process.cwd(), 'public', 'search-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(searchData, null, 2), 'utf8');

    if (process.env.NODE_ENV !== 'production') {
      console.log(`✓ Search data generated: ${searchData.length} mixes indexed`);
      console.log(`  Output: ${outputPath}`);
    }
  } catch (err) {
    console.error('Error generating search data:', err);
    process.exit(1);
  }
}

generateSearchData();
