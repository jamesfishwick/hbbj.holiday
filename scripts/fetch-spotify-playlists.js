const fs = require('node:fs');
const path = require('node:path');

/**
 * Fetches Spotify playlist data and generates m3u8 files
 *
 * Usage:
 *   SPOTIFY_CLIENT_ID=xxx SPOTIFY_CLIENT_SECRET=yyy node scripts/fetch-spotify-playlists.js
 *
 * Or set variables in .env and run:
 *   npm run fetch-spotify
 *
 * Requires environment variables:
 * - SPOTIFY_CLIENT_ID
 * - SPOTIFY_CLIENT_SECRET
 */

// Load .env file if it exists (for local development)
try {
  const dotenv = require('dotenv');
  dotenv.config();
} catch (_e) {
  // dotenv not installed, use environment variables directly
}

// Spotify playlist IDs to fetch
const PLAYLISTS = [
  { year: '2022', playlistId: '6jkANRACBJJ0esLdmtQY7T' },
  { year: '2024', playlistId: '7rKQy31YXcLRYtqakWiAqp' },
];

/**
 * Get Spotify access token using Client Credentials flow
 */
async function getSpotifyToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      'Missing Spotify credentials. Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET environment variables.'
    );
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error(`Failed to get Spotify token: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Fetch playlist tracks from Spotify
 */
async function fetchPlaylistTracks(playlistId, token) {
  const tracks = [];
  let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

  while (url) {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
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
          duration: Math.floor(item.track.duration_ms / 1000), // Convert to seconds
        });
      }
    }

    url = data.next;
  }

  return tracks;
}

/**
 * Generate m3u8 file content from tracks
 */
function generateM3U8Content(tracks, year) {
  let content = '#EXTM3U\n';

  for (let i = 0; i < tracks.length; i++) {
    const track = tracks[i];
    const trackNumber = String(i + 1).padStart(2, '0');
    const filename = `${trackNumber}-${track.name.replace(/[^a-zA-Z0-9]/g, '-')}.mp3`;

    content += `#EXTINF:${track.duration},${track.name} - ${track.artist}\n`;
    content += `/Users/loaneruser/Music/Music/Media.localized/Compilations/Happy Birthday Baby Jesus ${year}/${filename}\n`;
  }

  return content;
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('Fetching Spotify access token...');
    const token = await getSpotifyToken();
    console.log('Token obtained successfully');

    for (const { year, playlistId } of PLAYLISTS) {
      console.log(`\nProcessing ${year} playlist (${playlistId})...`);

      const tracks = await fetchPlaylistTracks(playlistId, token);
      console.log(`Found ${tracks.length} tracks`);

      const m3u8Content = generateM3U8Content(tracks, year);
      const outputPath = path.join(process.cwd(), 'content', 'mixes', year, `${year}.m3u8`);

      fs.writeFileSync(outputPath, m3u8Content, 'utf8');
      console.log(`✓ Generated ${outputPath}`);
      console.log(`  Preview of first 3 tracks:`);
      tracks.slice(0, 3).forEach((track, i) => {
        console.log(`  ${i + 1}. ${track.name} - ${track.artist}`);
      });
    }

    console.log('\n✓ All playlists processed successfully!');
  } catch (error) {
    console.error('\n✗ Error:', error.message);
    process.exit(1);
  }
}

main();
