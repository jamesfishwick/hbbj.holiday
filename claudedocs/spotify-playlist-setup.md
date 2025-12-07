# Spotify Playlist Search Setup

## Current Status

✅ **Completed:**
- Built Spotify playlist fetcher script
- Identified years with Spotify playlists: 2022, 2024
- Search functionality already supports playlist data
- Infrastructure ready to accept m3u8 files

⏳ **Pending:**
- Get Spotify API credentials
- Run fetcher to generate m3u8 files
- Test search with new tracklists

## How to Complete Setup

### 1. Get Spotify API Credentials

1. Go to https://developer.spotify.com/dashboard
2. Log in with your Spotify account
3. Click "Create app"
4. Fill in app details:
   - **App name**: "HBBJ Holiday Playlist Fetcher" (or any name)
   - **App description**: "Fetch playlist data for website search"
   - **Redirect URI**: http://localhost (not needed for this, but required field)
   - **APIs used**: Web API
5. Accept terms and click "Save"
6. Click "Settings" to view your Client ID and Client Secret

### 2. Configure Environment Variables

Edit `.env` file in project root and replace placeholders:

```env
SPOTIFY_CLIENT_ID=your_actual_client_id
SPOTIFY_CLIENT_SECRET=your_actual_client_secret
```

### 3. Run the Fetcher

```bash
npm run fetch-spotify
```

This will:
- Fetch all tracks from 2022 playlist (6jkANRACBJJ0esLdmtQY7T)
- Fetch all tracks from 2024 playlist (7rKQy31YXcLRYtqakWiAqp)
- Generate `content/mixes/2022/2022.m3u8`
- Generate `content/mixes/2024/2024.m3u8`

### 4. Verify Search Works

After generating the files:

1. Start dev server: `npm run dev`
2. Visit the site and use search
3. Search for a song/artist from 2022 or 2024 playlists
4. Verify the year shows up in search results

## What the Script Does

The fetcher:
1. Authenticates with Spotify using Client Credentials flow
2. Fetches all tracks from specified playlists (handles pagination)
3. Extracts: song name, artist(s), duration
4. Generates m3u8 files in the same format as existing years
5. Places files in correct directories for the Next.js app to find

## How Search Works

Once m3u8 files exist:
- `utils/mixes.mjs` reads all m3u8 files at build time
- Parses track data into searchable format
- `pages/api/search.js` searches across:
  - Post titles and descriptions
  - All track names and artists (from m3u8 files)
- Returns matching years with preview of matching tracks

## Current Playlist Configuration

```javascript
const PLAYLISTS = [
  { year: '2022', playlistId: '6jkANRACBJJ0esLdmtQY7T' },
  { year: '2024', playlistId: '7rKQy31YXcLRYtqakWiAqp' },
];
```

To add more years in the future, just add entries to this array in `scripts/fetch-spotify-playlists.js`.
