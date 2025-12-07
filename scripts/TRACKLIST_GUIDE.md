# Adding Tracklists to Markdown Frontmatter

## Overview

For years that only have Spotify playlists (2022, 2024), we add the tracklist directly to the markdown frontmatter instead of creating m3u8 files. This makes the tracks searchable without needing audio files.

## Quick Start

### 1. Get Spotify Credentials (One Time)

1. Visit https://developer.spotify.com/dashboard
2. Create an app, get Client ID and Client Secret
3. Set environment variables or add to `.env`

### 2. Generate YAML Tracklist

```bash
SPOTIFY_CLIENT_ID=xxx SPOTIFY_CLIENT_SECRET=yyy node scripts/fetch-spotify-to-yaml.js
```

This outputs YAML formatted tracklists for 2022 and 2024 that you can copy directly into the markdown frontmatter.

### 3. Add to Frontmatter

Copy the output and paste into the frontmatter of:
- `content/mixes/2022/2022.md`
- `content/mixes/2024/2024.md`

Example frontmatter format:

```yaml
---
title: 2022
description: May your holiday season be jam-packed with groovy tunes
date: 2022-12-19T11:00:00.000Z
tracklist:
  - name: "Track Name 1"
    artist: "Artist Name 1"
  - name: "Track Name 2"
    artist: "Artist Name 2"
---
```

## How It Works

1. **With m3u8 file** (years 2006-2021, 2023):
   - `utils/mixes.mjs` parses the m3u8 file
   - Extracts track names and artists
   - Makes them searchable

2. **With frontmatter tracklist** (years 2022, 2024):
   - `utils/mixes.mjs` reads `tracklist` from frontmatter
   - Formats it the same way as m3u8 data
   - Makes them searchable

3. **Search** (`pages/api/search.js`):
   - Searches across all track names and artists
   - Works the same for both m3u8 and frontmatter sources
   - Returns matching years with track previews

## Manual Alternative

If you don't want to use the Spotify API, you can manually create the tracklist:

1. Open the Spotify playlist in your browser
2. Copy the track names and artists
3. Format as YAML frontmatter (see example above)

## Benefits of This Approach

✅ No m3u8 files needed
✅ No audio files required
✅ Simpler than audio file generation
✅ Uses existing search infrastructure
✅ Only need Spotify credentials once
✅ Can be done manually if needed

## Files Modified

- `utils/mixes.mjs` - Falls back to frontmatter if no m3u8
- `content/mixes/2022/2022.md` - Example frontmatter format
- `scripts/fetch-spotify-to-yaml.js` - Generate YAML from Spotify
