import { metadataConfig } from './metadataConfig.js';

/**
 * Check if text contains any of the keywords
 */
function containsKeyword(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

/**
 * Check if text contains any of the exclude keywords
 */
function containsExclude(text, excludeKeywords) {
  if (!excludeKeywords) return false;
  return excludeKeywords.some((keyword) => text.includes(keyword));
}

/**
 * Shuffle array using Fisher-Yates algorithm (seeded for consistency)
 */
function shuffleArray(array, seed) {
  const arr = [...array];
  let currentIndex = arr.length;

  // Use seed to generate deterministic random numbers
  let random = seed;
  const seededRandom = () => {
    random = (random * 9301 + 49297) % 233280;
    return random / 233280;
  };

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(seededRandom() * currentIndex);
    currentIndex--;
    [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
  }

  return arr;
}

/**
 * Extract interesting metadata from mix descriptions and full content
 * Returns array of badge-worthy details (max 15 randomly selected if more)
 */
export function extractMetadata(description, content = '') {
  if (!description) return [];

  const badges = [];
  const combinedText = `${description} ${content}`.toLowerCase();
  const lowerDesc = description.toLowerCase();

  // Extract rarity markers from description only
  metadataConfig.rarity.forEach(({ keywords, badge }) => {
    if (containsKeyword(lowerDesc, keywords)) {
      badges.push(badge);
    }
  });

  // Extract pattern-based metadata from description
  Object.values(metadataConfig.patterns).forEach(({ regex, createBadge }) => {
    const match = description.match(regex);
    if (match) {
      const badge = createBadge(match);
      if (badge) badges.push(badge);
    }
  });

  // Extract genres from combined text
  const genres = [];
  metadataConfig.genres.forEach(({ keywords, badge }) => {
    if (containsKeyword(combinedText, keywords)) {
      genres.push(badge);
    }
  });
  badges.push(...genres);

  // Extract recording metadata from combined text
  metadataConfig.recording.forEach(({ keywords, exclude, badge }) => {
    if (containsKeyword(combinedText, keywords) && !containsExclude(combinedText, exclude)) {
      badges.push(badge);
    }
  });

  // Limit to 15 badges, randomly shuffled (seeded by description length for consistency)
  if (badges.length > 15) {
    const seed = description.length * 1000;
    const shuffled = shuffleArray(badges, seed);
    return shuffled.slice(0, 15);
  }

  return badges;
}

/**
 * Truncate description to specified length
 * Adds ellipsis and preserves word boundaries
 */
export function truncateDescription(description, maxLength = 150) {
  if (!description || description.length <= maxLength) {
    return description;
  }

  const truncated = description.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  return lastSpace > 0 ? `${truncated.slice(0, lastSpace)}...` : `${truncated}...`;
}
