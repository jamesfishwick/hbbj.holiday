/**
 * Metadata extraction configuration
 * Defines patterns and keywords for badge generation
 */

export const metadataConfig = {
  // Genre detection - searches combined description + content
  genres: [
    { keywords: ['punk'], badge: 'PUNK' },
    { keywords: ['indie'], badge: 'INDIE' },
    { keywords: ['exotica'], badge: 'EXOTICA' },
    { keywords: ['garage'], badge: 'GARAGE' },
    { keywords: ['gospel'], badge: 'GOSPEL' },
    { keywords: ['psych', 'psychedelic'], badge: 'PSYCH' },
    { keywords: ['funk'], badge: 'FUNK' },
    { keywords: ['folk'], badge: 'FOLK' },
    { keywords: ['r&b'], badge: 'R&B' },
    { keywords: ['soul'], badge: 'SOUL' },
    { keywords: ['rumba'], badge: 'RUMBA' },
    { keywords: ['cumbia'], badge: 'CUMBIA' },
    { keywords: ['blues'], badge: 'BLUES' },
    { keywords: ['jazz'], badge: 'JAZZ' },
    { keywords: ['reggae'], badge: 'REGGAE' },
    { keywords: ['country'], badge: 'COUNTRY' },
    { keywords: ['afrobeat'], badge: 'AFROBEAT' },
    { keywords: ['disco'], badge: 'DISCO' },
    { keywords: ['surf'], badge: 'SURF' },
    { keywords: ['house'], badge: 'HOUSE' },
    { keywords: ['techno'], badge: 'TECHNO' },
    { keywords: ['ambient'], badge: 'AMBIENT' },
    { keywords: ['drum and bass', 'drum & bass'], badge: 'DRUM & BASS' },
    { keywords: ['electronic', 'electro'], badge: 'ELECTRO' },
    { keywords: ['synthesizer', 'synth'], badge: 'SYNTHS' },
    { keywords: ['hip hop', 'hip-hop'], badge: 'HIP HOP' },
    { keywords: ['rockabilly'], badge: 'ROCKABILLY' },
    { keywords: ['doo-wop', 'doo wop'], badge: 'DOO-WOP' },
    { keywords: ['girl group'], badge: 'GIRL GROUP' },
    { keywords: ['lounge'], badge: 'LOUNGE' },
    { keywords: ['new wave'], badge: 'NEW WAVE' },
    { keywords: ['bluegrass'], badge: 'BLUEGRASS' },
    { keywords: ['novelty'], badge: 'NOVELTY' },
    { keywords: ['instrumental'], badge: 'INSTRUMENTAL' },
  ],

  // Rarity markers - searches description only
  rarity: [
    { keywords: ['rare', 'obscure'], badge: 'RARE' },
    { keywords: ['private press', 'self-released'], badge: 'PRIVATE PRESS' },
    { keywords: ['vinyl only', 'vinyl-only'], badge: 'VINYL ONLY' },
    { keywords: ['unreleased'], badge: 'UNRELEASED' },
  ],

  // Recording metadata - searches combined text
  recording: [
    {
      keywords: ['cover'],
      exclude: ['album cover'],
      badge: 'COVER',
    },
    {
      keywords: ['live', 'live at', 'live recording'],
      badge: 'LIVE',
    },
    {
      keywords: ['remix', 'remixed'],
      badge: 'REMIX',
    },
    {
      keywords: ['remaster', 'remastered', 'reissue'],
      badge: 'REMASTER',
    },
  ],

  // Pattern-based extraction (regex patterns)
  patterns: {
    // Extract copy count (e.g., "500 copies", "600 copies")
    copies: {
      regex: /(\d+)\s*copies/i,
      createBadge: (match) => `${match[1]} COPIES`,
    },
    // Extract track length for epics (6+ minutes)
    trackLength: {
      regex: /(\d+)[\s-]min/i,
      createBadge: (match) => (parseInt(match[1], 10) >= 6 ? `${match[1]}-MIN EPIC` : null),
    },
  },
};
