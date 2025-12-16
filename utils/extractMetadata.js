/**
 * Extract interesting metadata from mix descriptions
 * Returns array of badge-worthy details
 */
export function extractMetadata(description) {
  if (!description) return [];

  const badges = [];
  const lowerDesc = description.toLowerCase();

  // Rare/limited editions
  if (lowerDesc.includes('rare') || lowerDesc.includes('obscure')) {
    badges.push('RARE');
  }
  if (lowerDesc.includes('private press') || lowerDesc.includes('self-released')) {
    badges.push('PRIVATE PRESS');
  }
  if (lowerDesc.match(/\d+\s*copies/i)) {
    const match = description.match(/(\d+)\s*copies/i);
    if (match) badges.push(`${match[1]} COPIES`);
  }

  // Genre highlights (limit to 2)
  const genres = [];
  if (lowerDesc.includes('punk')) genres.push('PUNK');
  if (lowerDesc.includes('exotica')) genres.push('EXOTICA');
  if (lowerDesc.includes('garage')) genres.push('GARAGE');
  if (lowerDesc.includes('gospel')) genres.push('GOSPEL');
  if (lowerDesc.includes('psych') || lowerDesc.includes('psychedelic')) genres.push('PSYCH');
  if (lowerDesc.includes('funk')) genres.push('FUNK');
  if (lowerDesc.includes('soul')) genres.push('SOUL');

  // Add up to 2 genre badges
  badges.push(...genres.slice(0, 2));

  // Track lengths
  if (lowerDesc.match(/\d+[\s-]min/i)) {
    const match = description.match(/(\d+)[\s-]min/i);
    if (match && parseInt(match[1], 10) >= 6) {
      badges.push(`${match[1]}-MIN EPIC`);
    }
  }

  // Other interesting markers
  if (lowerDesc.includes('vinyl only') || lowerDesc.includes('vinyl-only')) {
    badges.push('VINYL ONLY');
  }
  if (lowerDesc.includes('unreleased')) {
    badges.push('UNRELEASED');
  }

  // Return max 3 badges to avoid clutter
  return badges.slice(0, 3);
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
