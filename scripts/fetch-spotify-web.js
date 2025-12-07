/**
 * Fetch Spotify playlist tracklists from the web (no API credentials needed)
 * Uses Playwright MCP to scrape playlist data directly from Spotify web player
 *
 * Usage:
 *   node scripts/fetch-spotify-web.js
 */

const PLAYLISTS = [
  { year: '2022', playlistId: '6jkANRACBJJ0esLdmtQY7T' },
  { year: '2024', playlistId: '7rKQy31YXcLRYtqakWiAqp' },
];

function generateYAML(tracks) {
  let yaml = 'tracklist:\n';
  for (const track of tracks) {
    // Escape quotes and handle special characters
    const name = track.name.replace(/"/g, '\\"').replace(/\n/g, ' ');
    const artist = track.artist.replace(/"/g, '\\"').replace(/\n/g, ' ');
    yaml += `  - name: "${name}"\n`;
    yaml += `    artist: "${artist}"\n`;
  }
  return yaml;
}

async function main() {
  console.log('📝 This script requires Claude Code with Playwright MCP enabled');
  console.log('   It will fetch playlist data directly from Spotify web player\n');

  for (const { year, playlistId } of PLAYLISTS) {
    const url = `https://open.spotify.com/playlist/${playlistId}`;
    console.log(`\n========== ${year} ==========`);
    console.log(`Playlist URL: ${url}`);
    console.log(`\nTo fetch this playlist, ask Claude Code:`);
    console.log(`  "Use Playwright to navigate to ${url} and extract all track names and artists"`);
    console.log(`  Then copy the YAML output into content/mixes/${year}/${year}.md frontmatter`);
  }

  console.log('\n\n💡 Alternative: Use the API-based fetcher if you have Spotify credentials:');
  console.log('   node scripts/fetch-spotify-to-yaml.js');
}

main();
