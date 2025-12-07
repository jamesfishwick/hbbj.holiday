# Next Steps: Making Spotify Playlists Searchable

## ✅ What's Ready

- ✅ Spotify playlist fetcher script created
- ✅ Credential test script created
- ✅ npm scripts configured: `fetch-spotify`, `test-spotify`
- ✅ .env template created
- ✅ Search functionality already supports playlist data
- ✅ All committed to `feature/spotify-playlists` branch

## 🎯 What You Need to Do Next

### 1. Get Spotify API Credentials (5 minutes)

1. **Visit:** https://developer.spotify.com/dashboard
2. **Log in** with your Spotify account
3. **Click "Create app"**
4. **Fill in:**
   - App name: `HBBJ Holiday Playlist Fetcher`
   - App description: `Fetch playlist data for website search`
   - Redirect URI: `http://localhost` (required but not used)
   - API: Select "Web API"
5. **Click Settings** to view your **Client ID** and **Client Secret**

### 2. Add Credentials to .env

Edit `/Users/jamesfishwick/Workspace/hbbj.holiday-spotify/.env`:

```env
SPOTIFY_CLIENT_ID=paste_your_client_id_here
SPOTIFY_CLIENT_SECRET=paste_your_client_secret_here
```

### 3. Test Your Credentials

```bash
cd /Users/jamesfishwick/Workspace/hbbj.holiday-spotify
npm run test-spotify
```

You should see:
```
✅ Successfully authenticated with Spotify!
✅ Successfully accessed playlist: "..."
🎉 All tests passed! You can now run: npm run fetch-spotify
```

### 4. Generate the m3u8 Files

```bash
npm run fetch-spotify
```

This will create:
- `content/mixes/2022/2022.m3u8` (with all tracks from 2022 Spotify playlist)
- `content/mixes/2024/2024.m3u8` (with all tracks from 2024 Spotify playlist)

### 5. Verify Search Works

```bash
npm run dev
```

Then search for a song or artist you know is in the 2022 or 2024 playlists.
You should see those years appear in search results!

## 🎵 Current Playlist Configuration

- **2022:** Playlist ID `6jkANRACBJJ0esLdmtQY7T`
- **2024:** Playlist ID `7rKQy31YXcLRYtqakWiAqp`

## 📚 Reference

- **Detailed setup:** `scripts/README.md`
- **Full guide:** `claudedocs/spotify-playlist-setup.md`
- **Test script:** `scripts/test-spotify-credentials.js`
- **Fetch script:** `scripts/fetch-spotify-playlists.js`

## 💡 Optional: Install dotenv

If you want .env file support (optional - scripts work without it):

```bash
npm install dotenv
```

The scripts will automatically use .env if dotenv is installed, or you can
set environment variables directly when running the scripts.

## ⚠️ Note

- `.env` is gitignored - your credentials stay private
- `.env.example` is the template (safe to commit)
- The generated m3u8 files should be committed so search works in production
