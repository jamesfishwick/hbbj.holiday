import 'lazysizes';

export function Image({ alt, src, previewSrc, webpSrc, className }) {
  // Extract srcSet from webpack module objects or use as-is if string
  const getSrcSet = (value) => {
    if (typeof value === 'object' && value !== null) {
      // Webpack loaders return ES6 modules with default export
      return value.default || value.srcSet || value.src || '';
    }
    return value || '';
  };

  return (
    <picture className={className}>
      <source type="image/webp" data-srcset={getSrcSet(webpSrc)} />
      <source type="image/png" data-srcset={getSrcSet(src)} />
      <img className={`lazyload blur ${className}`} alt={alt} src={previewSrc} />
    </picture>
  );
}
