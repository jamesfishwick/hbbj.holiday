# Spotify Playlist Fetcher

This script fetches track data from Spotify playlists and generates `.m3u8` files for use with the site's search functionality.

## Setup

1. **Get Spotify API credentials:**
   - Go to https://developer.spotify.com/dashboard
   - Create an app (or use an existing one)
   - Copy your Client ID and Client Secret

2. **Create a `.env` file in the project root:**
   ```bash
   cp .env.example .env
   ```

3. **Add your Spotify credentials to `.env`:**
   ```env
   SPOTIFY_CLIENT_ID=your_client_id_here
   SPOTIFY_CLIENT_SECRET=your_client_secret_here
   ```

## Usage

Run the script to fetch playlist data and generate m3u8 files:

```bash
npm run fetch-spotify
```

This will:
- Authenticate with Spotify using your credentials
- Fetch tracks from the configured playlists (2022 and 2024)
- Generate `.m3u8` files in the respective year directories
- Make the tracks searchable through the site's search functionality

## Adding More Playlists

To add more Spotify playlists:

1. Edit `scripts/fetch-spotify-playlists.js`
2. Add entries to the `PLAYLISTS` array:
   ```javascript
   const PLAYLISTS = [
     { year: '2022', playlistId: '6jkANRACBJJ0esLdmtQY7T' },
     { year: '2024', playlistId: '7rKQy31YXcLRYtqakWiAqp' },
     { year: 'YYYY', playlistId: 'your_playlist_id' }, // Add new ones here
   ];
   ```

## Finding Playlist IDs

Spotify playlist IDs can be found in the playlist URL or embed code:
- URL format: `https://open.spotify.com/playlist/[PLAYLIST_ID]`
- Embed format: `https://open.spotify.com/embed/playlist/[PLAYLIST_ID]`

For example, in the 2022 post, the embed URL contains: `6jkANRACBJJ0esLdmtQY7T`
