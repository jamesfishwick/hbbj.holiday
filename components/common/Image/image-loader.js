export default function imageLoader({ src }) {
  // For absolute URLs (external images), return as-is
  if (src.startsWith('http') || src.startsWith('//')) {
    return src;
  }

  // For local images, return the path
  return src;
}
