const fs = require('node:fs');

// Load .env file if dotenv is available
try {
  require('dotenv').config();
} catch (e) {
  // dotenv not installed, use environment variables directly
}

/**
 * Test Spotify API credentials
 * Run this to verify your credentials work before running the full fetcher
 *
 * Usage:
 *   SPOTIFY_CLIENT_ID=xxx SPOTIFY_CLIENT_SECRET=yyy node scripts/test-spotify-credentials.js
 * Or set variables in .env and run:
 *   npm run test-spotify
 */

async function testCredentials() {
  console.log('🔍 Testing Spotify API credentials...\n');

  // Check if .env exists and has values
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || clientId === 'your_client_id_here') {
    console.error('❌ SPOTIFY_CLIENT_ID is missing or not set in .env file');
    console.error('   Please edit .env and add your Client ID from Spotify Dashboard\n');
    process.exit(1);
  }

  if (!clientSecret || clientSecret === 'your_client_secret_here') {
    console.error('❌ SPOTIFY_CLIENT_SECRET is missing or not set in .env file');
    console.error('   Please edit .env and add your Client Secret from Spotify Dashboard\n');
    process.exit(1);
  }

  console.log('✓ Environment variables found');
  console.log(`  Client ID: ${clientId.substring(0, 8)}...`);
  console.log(`  Client Secret: ${clientSecret.substring(0, 8)}...\n`);

  // Try to get a token
  try {
    console.log('🔐 Requesting access token from Spotify...');

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`❌ Failed to authenticate with Spotify (${response.status})`);
      console.error(`   ${error}\n`);
      console.error('   Check that your credentials are correct in .env\n');
      process.exit(1);
    }

    const data = await response.json();
    console.log('✅ Successfully authenticated with Spotify!\n');
    console.log(`   Token type: ${data.token_type}`);
    console.log(`   Expires in: ${data.expires_in} seconds\n`);

    // Try to fetch one of the playlists
    console.log('🎵 Testing playlist access...');
    const playlistResponse = await fetch(
      'https://api.spotify.com/v1/playlists/6jkANRACBJJ0esLdmtQY7T',
      {
        headers: {
          'Authorization': `Bearer ${data.access_token}`,
        },
      }
    );

    if (!playlistResponse.ok) {
      console.error(`❌ Failed to access playlist (${playlistResponse.status})`);
      console.error('   Your credentials work, but there may be an issue with the playlist\n');
      process.exit(1);
    }

    const playlist = await playlistResponse.json();
    console.log(`✅ Successfully accessed playlist: "${playlist.name}"`);
    console.log(`   Total tracks: ${playlist.tracks.total}\n`);

    console.log('🎉 All tests passed! You can now run: npm run fetch-spotify\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testCredentials();
