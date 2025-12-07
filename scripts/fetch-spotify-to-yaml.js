const fs = require('node:fs');

/**
 * Fetch Spotify playlist and output as YAML frontmatter format
 * Run once to get tracklist data, then copy into markdown frontmatter
 *
 * Usage:
 *   SPOTIFY_CLIENT_ID=xxx SPOTIFY_CLIENT_SECRET=yyy node scripts/fetch-spotify-to-yaml.js
 */

// Load .env file if dotenv is available
try {
  require('dotenv').config();
} catch (e) {
  // dotenv not installed, use environment variables directly
}

const PLAYLISTS = [
  { year: '2022', playlistId: '6jkANRACBJJ0esLdmtQY7T' },
  { year: '2024', playlistId: '7rKQy31YXcLRYtqakWiAqp' },
];

async function getSpotifyToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      'Missing Spotify credentials. Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET'
    );
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error(`Failed to get Spotify token: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function fetchPlaylistTracks(playlistId, token) {
  const tracks = [];
  let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

  while (url) {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch playlist: ${response.statusText}`);
    }

    const data = await response.json();

    for (const item of data.items) {
      if (item.track) {
        tracks.push({
          name: item.track.name,
          artist: item.track.artists.map((a) => a.name).join(', '),
        });
      }
    }

    url = data.next;
  }

  return tracks;
}

function generateYAML(tracks) {
  let yaml = 'tracklist:\n';
  for (const track of tracks) {
    yaml += `  - name: "${track.name.replace(/"/g, '\\"')}"\n`;
    yaml += `    artist: "${track.artist.replace(/"/g, '\\"')}"\n`;
  }
  return yaml;
}

async function main() {
  try {
    console.log('Fetching Spotify access token...');
    const token = await getSpotifyToken();
    console.log('Token obtained\n');

    for (const { year, playlistId } of PLAYLISTS) {
      console.log(`\n========== ${year} ==========`);
      console.log(`Fetching playlist ${playlistId}...`);

      const tracks = await fetchPlaylistTracks(playlistId, token);
      console.log(`Found ${tracks.length} tracks\n`);

      const yaml = generateYAML(tracks);
      console.log('Add this to the frontmatter of content/mixes/' + year + '/' + year + '.md:\n');
      console.log(yaml);
      console.log('\n');
    }

    console.log('\n✓ Done! Copy the YAML above into your markdown frontmatter.');
  } catch (error) {
    console.error('\n✗ Error:', error.message);
    process.exit(1);
  }
}

main();
