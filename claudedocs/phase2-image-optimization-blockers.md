# Phase 2: Image Optimization Blockers

**Date**: 2025-12-06
**Status**: Documentation for future migration planning

## Current State

### Package Versions (package.json)
- `next-lqip-images`: ^0.1.0 (NOT INSTALLED - missing from node_modules)
- `next-optimized-images`: ^2.6.2 (DEPRECATED)
- `lqip-loader`: ^2.2.1 (DEPRECATED)
- `responsive-loader`: ^3.1.2 (DEPRECATED)
- `sharp`: ^0.33.5 (Native build failures on macOS)

### Current Image Implementation
**Custom Image Component**: `/components/common/Image/Image.js`

```javascript
import 'lazysizes';

export function Image({ alt, src, previewSrc, webpSrc, className }) {
  return (
    <picture className={className}>
      <source type="image/webp" data-srcset={webpSrc} />
      <source type="image/png" data-srcset={src} />
      <img className={`lazyload blur ${className}`} alt={alt} src={previewSrc} />
    </picture>
  );
}
```

**Features**:
- Client-side lazy loading via `lazysizes` library
- WebP format support with fallback
- Low-quality image placeholders (LQIP) for blur-up effect
- Responsive images via `responsive-loader`

**Usage Pattern**:
```jsx
<Image
  alt="HBBJ"
  src={require(`../content/assets/${title}.jpg`)}
  webpSrc={require(`../content/assets/${title}.jpg?webp`)}
  previewSrc={require(`../content/assets/${title}.jpg?lqip`)}
  className="w-full mb-3 transition-transform duration-300 hover:scale-105"
/>
```

## Critical Blockers

### 1. Sharp Native Build Failures

**Error**:
```
libtool: error: unrecognised option: '-static'
make: *** [Release/nothing.a] Error 1
gyp ERR! build error
gyp ERR! stack Error: `make` failed with exit code: 2
```

**Root Cause**:
- Homebrew `libtool` conflicts with macOS system `libtool`
- Sharp v0.33.5 native bindings incompatible with current macOS toolchain
- `next-lqip-images@0.1.0` depends on vulnerable sharp versions

**Impact**:
- Cannot install `next-lqip-images` package
- Cannot rebuild image optimization pipeline
- Prevents clean npm install on fresh clones

### 2. Deprecated Package Ecosystem

**Unmaintained Packages**:
- `next-optimized-images` (last updated 2020)
- `lqip-loader` (last updated 2020)
- `next-lqip-images` (last updated 2020)
- `responsive-loader` (maintenance mode)

**Impact**:
- No Next.js 13+ compatibility
- Security vulnerabilities in dependencies
- No modern image format support (AVIF)
- Blocks Next.js upgrade path

### 3. Next.js Version Lock

**Current**: Next.js 12.0.7 (Dec 2021)
**Latest**: Next.js 16.0.7 (Dec 2025)
**Gap**: 4 major versions behind

**Blocked Features**:
- Built-in Image Optimization with `next/image`
- App Router architecture
- Server Components
- Improved performance and SEO
- Modern build optimizations

## Phase 2 Migration Path

### Option A: Migrate to next/image (Recommended)

**Effort**: 2-3 hours
**Risk**: Medium
**Benefits**: Modern, maintained, optimized

**Steps**:
1. **Remove Deprecated Packages**
   ```bash
   npm uninstall next-optimized-images lqip-loader next-lqip-images responsive-loader webp-loader
   ```

2. **Install Sharp Directly**
   ```bash
   npm install sharp@latest
   ```
   - If native build fails, use prebuilt binaries or Docker

3. **Update next.config.js**
   ```javascript
   module.exports = {
     images: {
       formats: ['image/avif', 'image/webp'],
       deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
       imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
     },
   }
   ```

4. **Migrate Image Component**
   ```jsx
   import NextImage from 'next/image';

   export function Image({ alt, src, className }) {
     return (
       <NextImage
         src={src}
         alt={alt}
         className={className}
         placeholder="blur"
         quality={90}
         loading="lazy"
       />
     );
   }
   ```

5. **Update All Image Usages**
   - Remove `webpSrc` and `previewSrc` props
   - Import images as static imports (not require())
   - Add width/height or fill prop for layout

**Breaking Changes**:
- Requires static imports or external URLs
- No runtime require() with template strings
- May need build-time image processing for dynamic paths

### Option B: Keep Current System + Workarounds

**Effort**: 30 minutes
**Risk**: Low
**Limitations**: Stays on Next.js 12, no modern features

**Steps**:
1. Document `next-lqip-images` as unavailable
2. Keep using existing lazysizes implementation
3. Accept Next.js 12 limitation
4. Plan for eventual migration when resources allow

## Recommendations

### Immediate (Phase 1) ✅ COMPLETED
- [x] Update package.json to reflect actual installed versions
- [x] Document blockers for future reference
- [x] Keep site functional on current system

### Phase 2 (Future Migration)
- [ ] Allocate 2-3 hour block for image migration
- [ ] Test migration on feature branch first
- [ ] Migrate to next/image with Next.js 13+
- [ ] Upgrade React 17 → 18+ in same phase
- [ ] Add AVIF format support

### Phase 3 (Post-Migration)
- [ ] Upgrade to Next.js 14+ (App Router optional)
- [ ] Implement Server Components selectively
- [ ] Optimize image loading performance
- [ ] Add responsive image sizes for bandwidth optimization

## Technical Debt Summary

**High Priority**:
- Image optimization packages (blocks Next.js upgrade)
- Next.js version gap (4 major versions)
- React version gap (2 major versions)

**Medium Priority**:
- Sharp native build issues (workaround exists)
- Deprecated package warnings (site functional)

**Low Priority**:
- Modern image formats (AVIF support)
- Server Components (optional Next.js 13+ feature)

## Success Criteria for Phase 2

- [ ] Clean npm install without errors
- [ ] Next.js 13+ running successfully
- [ ] All images loading with blur placeholders
- [ ] WebP/AVIF format support
- [ ] Lighthouse performance score maintained or improved
- [ ] No visual regressions from current design
