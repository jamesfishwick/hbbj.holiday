# Happy Birthday Baby Jesus 🎄

[![Netlify Status](https://api.netlify.com/api/v1/badges/894eedac-f1b5-4686-9fc1-702429c02b78/deploy-status)](https://app.netlify.com/sites/epic-goldwasser-5d43ce/deploys)

Annual Christmas music compilation curated by Sir Lord Selector.

## Live Site

🔗 **https://hbbj.holiday**

## Tech Stack

- **Framework**: Next.js 12.0.7
- **Styling**: Tailwind CSS 2.2.19
- **Linting & Formatting**: Biome 2.3.8
- **Deployment**: Netlify
- **Node**: 20.18.2

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Export static site
npm run export

# Lint and format
npm run lint
npm run lint:fix
npm run format
```

## Deployment

The site automatically deploys to Netlify when changes are pushed to the `master` branch.

Build command: `node scripts/generate-sitemap.mjs && npm run build && npx next export`

## Music Compilations

Each year features a unique playlist of eclectic Christmas and holiday-themed music tracks, available from 2006-2024.
