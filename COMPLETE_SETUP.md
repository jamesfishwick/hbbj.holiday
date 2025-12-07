# Complete the Spotify Tracklist Setup

## Current Status

✅ **Code is ready** - frontmatter tracklist support implemented
✅ **Scripts created** - `fetch-spotify-to-yaml.js` ready to run
✅ **Example added** - `2022.md` has example format

⏳ **Need to add actual tracklists** to 2022.md and 2024.md

## Option 1: Use Spotify API (Recommended - 5 minutes)

### Step 1: Get Spotify Credentials

1. Visit https://developer.spotify.com/dashboard
2. Log in with Spotify account
3. Click "Create app"
4. Fill in:
   - App name: `HBBJ Holiday Tracklist Fetcher`
   - App description: `Fetch tracklist data`
   - Redirect URI: `http://localhost`
   - API: Web API
5. Click Settings → Copy Client ID and Client Secret

### Step 2: Add to .env

Edit `.env` in project root:

```bash
SPOTIFY_CLIENT_ID=paste_your_actual_client_id_here
SPOTIFY_CLIENT_SECRET=paste_your_actual_client_secret_here
```

### Step 3: Run the Fetcher

```bash
cd /Users/jamesfishwick/Workspace/hbbj.holiday-spotify
node scripts/fetch-spotify-to-yaml.js
```

This will output YAML like:

```yaml
========== 2022 ==========
tracklist:
  - name: "Track Name 1"
    artist: "Artist Name 1"
  - name: "Track Name 2"
    artist: "Artist Name 2"
  ...
```

### Step 4: Copy to Markdown Files

1. Copy the 2022 tracklist YAML
2. Paste into `content/mixes/2022/2022.md` frontmatter (replace the example)
3. Copy the 2024 tracklist YAML
4. Paste into `content/mixes/2024/2024.md` frontmatter

### Step 5: Commit the Changes

```bash
git add content/mixes/2022/2022.md content/mixes/2024/2024.md
git commit -m "Add Spotify tracklists to 2022 and 2024 frontmatter"
```

### Step 6: Test Search

```bash
npm run dev
```

Search for a song/artist from 2022 or 2024 - should appear in results!

---

## Option 2: Manual Entry (No API needed - 15 minutes)

### For 2022 Playlist

1. Open https://open.spotify.com/playlist/6jkANRACBJJ0esLdmtQY7T
2. Copy all track names and artists
3. Format as YAML in `content/mixes/2022/2022.md`:

```yaml
---
title: 2022
description: May your holiday season be jam-packed with groovy tunes
date: 2022-12-19T11:00:00.000Z
tracklist:
  - name: "First Track Name"
    artist: "First Artist Name"
  - name: "Second Track Name"
    artist: "Second Artist Name"
  # ... add all tracks
---
```

### For 2024 Playlist

1. Open https://open.spotify.com/playlist/7rKQy31YXcLRYtqakWiAqp
2. Copy all track names and artists
3. Format as YAML in `content/mixes/2024/2024.md`

### Commit and Test

Same as Option 1, steps 5-6

---

## Verification

After adding tracklists, verify they work:

```bash
# Start dev server
npm run dev

# Test search
# 1. Open browser to localhost:3000
# 2. Use search feature
# 3. Search for a song from 2022 or 2024
# 4. Verify the year appears in results with matching tracks
```

## What This Enables

Once complete, users can search for:
- Song names from 2022 and 2024 playlists
- Artist names from 2022 and 2024 playlists
- Years will appear in search results
- Preview of matching tracks shown

## Files to Modify

- `content/mixes/2022/2022.md` - Add full tracklist
- `content/mixes/2024/2024.md` - Add full tracklist (create if needed)

## Help

See:
- `scripts/TRACKLIST_GUIDE.md` - Detailed workflow guide
- `NEXT_STEPS.md` - Original setup instructions
- `scripts/fetch-spotify-to-yaml.js` - The fetcher script
