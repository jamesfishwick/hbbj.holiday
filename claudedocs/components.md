# Component Pattern Library

Comprehensive documentation for all reusable components in the HBBJ.Holiday project.

## Design System Integration

All components follow the Phase 1 design system:
- **Semantic colors**: primary, accent, surface, danger
- **8px spacing scale**: Consistent visual rhythm
- **Animation tokens**: fast (150ms), normal (250ms), slow (400ms)
- **WCAG 2.1 AA compliance**: All color combinations tested
- **Focus-visible states**: Keyboard navigation support

---

## Components

### Bio

**Purpose**: Author biography section with profile image and Instagram link

**Location**: `components/common/Bio/Bio.js`

**Props**:
```javascript
{
  className: PropTypes.string  // Optional additional CSS classes
}
```

**Usage**:
```javascript
import { Bio } from '@components/common';

<Bio className="my-14" />
```

**Accessibility Features**:
- Profile image has descriptive alt text
- Instagram link has min 44px touch target
- Color transitions use semantic teal → light-blue colors
- Hover scale animation on profile image

**Design System**:
- Uses semantic colors (light-blue for name, teal for link)
- Normal (250ms) transition duration
- 8px spacing (p-6, mb-4, mr-4)

---

### ErrorBoundary

**Purpose**: Catches React errors and displays fallback UI to prevent app crashes

**Location**: `components/common/ErrorBoundary/ErrorBoundary.js`

**Props**:
```javascript
{
  children: PropTypes.node.isRequired  // Child components to protect
}
```

**Usage**:
```javascript
import { ErrorBoundary } from '@components/common';

<ErrorBoundary>
  <YourApp />
</ErrorBoundary>
```

**Features**:
- Catches errors in child component tree
- Displays friendly fallback UI with recovery options
- Shows error details in development mode only
- "Try Again" button to reset error state
- "Go to Homepage" fallback link
- Console logging for debugging

**Accessibility Features**:
- Clear error messaging
- Keyboard accessible action buttons
- Focus management on error state
- Screen reader friendly error announcements

**Design System**:
- Uses danger color (#D70023) for error icon
- Teal accent for primary action buttons
- Semantic spacing and transitions

---

### Heading

**Purpose**: Semantic heading component with consistent styling

**Location**: `components/common/Heading/Heading.js`

**Props**:
```javascript
{
  level: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),  // Default: 'h2'
  variant: PropTypes.oneOf(['display', 'section', 'subsection', 'card']),  // Default: 'section'
  className: PropTypes.string,  // Optional additional classes
  children: PropTypes.node.isRequired  // Heading content
}
```

**Variants**:
- **display**: Largest heading (text-5xl sm:text-6xl) for hero sections
- **section**: Major section heading (text-4xl) for primary content divisions
- **subsection**: Minor section heading (text-2xl) for content subsections
- **card**: Card title heading (text-xl) for component titles

**Usage**:
```javascript
import { Heading } from '@components/common';

<Heading level="h1" variant="display">
  Happy Birthday Baby Jesus
</Heading>

<Heading level="h2" variant="section">
  2025 Mix
</Heading>

<Heading level="h3" variant="subsection" className="mt-8">
  Track-by-Track Guide
</Heading>
```

**Utility Class Alternatives** (for markdown/static content):
```html
<h1 class="heading-display">Display Heading</h1>
<h2 class="heading-section">Section Heading</h2>
<h3 class="heading-subsection">Subsection Heading</h3>
<h4 class="heading-card">Card Heading</h4>
```

**Accessibility Features**:
- Semantic HTML heading levels (h1-h6)
- Visual style decoupled from semantic level
- Proper heading hierarchy maintained

**Design System**:
- All variants use font-display (Open Sans)
- Light-blue (#B2DCF4) for display/section/card variants
- Cream (#F8FFF6) for subsection variant
- Fluid typography with clamp() for responsive scaling

---

### Image

**Purpose**: Optimized image component with lazy loading and WebP support

**Location**: `components/common/Image/Image.js`

**Props**:
```javascript
{
  alt: PropTypes.string.isRequired,  // Descriptive alt text
  src: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,  // Main image source
  previewSrc: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,  // LQIP preview
  webpSrc: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,  // WebP version
  className: PropTypes.string  // Optional CSS classes
}
```

**Usage**:
```javascript
import { Image } from '@components/common';

<Image
  alt="Christmas music playlist cover"
  src={require('../content/assets/2025.jpg')}
  webpSrc={require('../content/assets/2025.jpg?webp')}
  previewSrc={require('../content/assets/2025.jpg?lqip')}
  className="w-full"
/>
```

**Features**:
- Progressive image loading with LQIP (Low Quality Image Placeholder)
- WebP format with fallback to PNG/JPEG
- Lazy loading using lazysizes library
- Blur effect during loading
- Webpack loader integration for automatic optimization

**Accessibility Features**:
- Required descriptive alt text
- Proper picture element with source fallbacks

**Performance**:
- Deferred loading for off-screen images
- Modern WebP format for smaller file sizes
- LQIP provides instant visual feedback

---

### Layout

**Purpose**: Main application layout with header, navigation, and footer

**Location**: `components/common/Layout/Layout.js`

**Props**:
```javascript
{
  children: PropTypes.node.isRequired  // Page content
}
```

**Usage**:
```javascript
import { Layout } from '@components/common';

<Layout>
  <YourPageContent />
</Layout>
```

**Features**:
- Responsive site header with conditional sizing (large on homepage, small on other pages)
- Christmas lights decorative element
- Skip-to-content link for accessibility
- Integrated search component on homepage only
- Footer with copyright and framework credit

**Accessibility Features**:
- Skip-to-content link (sr-only, visible on focus)
- Main landmark (#main-content)
- Decorative elements marked aria-hidden
- 44px+ touch targets on all links
- Focus-visible states on all interactive elements

**Design System**:
- Dark-blue (#1F2B5D) background
- Cream (#F8FFF6) text
- Light-blue (#B2DCF4) for site title
- Teal (#29AFBB) for link hover states
- Fast (150ms) color transitions

---

### MixCardSkeleton

**Purpose**: Loading skeleton for mix cards during data fetching

**Location**: `components/common/MixCardSkeleton/MixCardSkeleton.js`

**Props**: None

**Usage**:
```javascript
import { MixCardSkeleton } from '@components/common';

{isLoading && <MixCardSkeleton />}
```

**Features**:
- Matches mix card dimensions and structure
- Pulse animation for loading indication
- No external dependencies

**Accessibility Features**:
- aria-busy="true" announces loading state
- aria-label describes what's loading
- Screen reader friendly loading indication

**Design System**:
- Matches mix card border and shadow styling
- Light-blue border with opacity
- Tailwind animate-pulse utility

---

### PlaylistDisplay

**Purpose**: Displays tracklist with zebra striping, visual grouping, and formatted metadata

**Location**: `components/common/Playlist/Playlist.js`

**Props**:
```javascript
{
  tracks: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      singer: PropTypes.string,  // Alternate artist field
      artist: PropTypes.string,
      duration: PropTypes.number  // In seconds
    })
  )
}
```

**Usage**:
```javascript
import { PlaylistDisplay } from '@components/common';

<PlaylistDisplay tracks={[
  { name: 'Silent Night', singer: 'Various Artists', duration: 210 },
  { name: 'Jingle Bells', artist: 'Frank Sinatra', duration: 165 }
]} />
```

**Features**:
- Zebra striping for improved readability (alternating backgrounds)
- Visual grouping every 5 tracks with separator border
- Teal track numbers for visibility
- Music note icon in header
- Track count display
- Duration formatting (mm:ss)
- Responsive design (mobile-friendly)

**Accessibility Features**:
- Semantic heading (h3) for tracklist title
- Music note icon has role="img" and aria-label
- Readable track numbering with monospace font
- High contrast text colors

**Design System**:
- Teal (#29AFBB) for track numbers and header icon
- Cream (#F8FFF6) for primary text
- Zebra striping with subtle opacity variations
- 8px-based spacing (p-3, p-6, mb-6)

---

### Search

**Purpose**: Real-time search for mixes and tracks with keyboard navigation

**Location**: `components/common/Search/Search.jsx`

**Props**: None (self-contained component)

**Usage**:
```javascript
import Search from '@components/common/Search/Search';

<Search />
```

**Features**:
- Client-side search from JSON data file
- Search in mix titles, descriptions, and track listings
- Real-time results as you type
- Keyboard navigation (Arrow keys, Enter, Escape)
- Matching track preview (up to 3 tracks per mix)
- Search icon and enhanced loading indicator
- Slide-in animations for results
- Year badges for each mix
- Music note icons for matching tracks
- Enhanced empty and error states

**Accessibility Features**:
- Full WCAG 2.1 AA compliance
- Combobox ARIA pattern
- Keyboard navigation support
- Screen reader live region for result announcements
- Focus management with visual indicators
- aria-activedescendant for focused result
- Descriptive error and empty states

**Design System**:
- Teal (#29AFBB) focus ring and accents
- Enhanced focus states with scale and shadow
- Slide-in animations (200ms base + 50ms stagger)
- Year badges with teal background
- Music note icons in brand colors
- Enhanced empty/error states with icons

---

### SEO

**Purpose**: Comprehensive SEO meta tags and JSON-LD structured data

**Location**: `components/common/Seo/Seo.js`

**Props**:
```javascript
{
  title: PropTypes.string.isRequired,  // Page title
  description: PropTypes.string,  // Meta description
  image: PropTypes.string,  // OG image path
  article: PropTypes.bool,  // Is this an article page?
  publishedDate: PropTypes.string,  // ISO date string
  modifiedDate: PropTypes.string,  // ISO date string
  slug: PropTypes.string,  // Page slug for URL
  playlist: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    musicName: PropTypes.string,
    singer: PropTypes.string,
    artist: PropTypes.string
  }))
}
```

**Usage**:
```javascript
import { SEO } from '@components/common';

// Homepage
<SEO title="Best Christmas Music Playlists" />

// Mix page
<SEO
  title="2025 Christmas Mix"
  description="Handpicked holiday hits and festive gems"
  article={true}
  publishedDate="2025-12-01T00:00:00Z"
  slug="2025"
  playlist={mixTracks}
/>
```

**Features**:
- Basic meta tags (title, description, keywords, canonical)
- Open Graph tags for social sharing
- Twitter Card meta tags
- Article-specific OG tags
- JSON-LD structured data:
  - WebSite schema
  - Organization schema
  - Article schema (for mixes)
  - MusicPlaylist schema (when playlist data exists)
  - Breadcrumb schema (for navigation)
  - FAQPage schema (homepage)
- Analytics integration (Plausible)
- Google Search Console verification
- Favicon and app icons

**SEO Best Practices**:
- Semantic HTML in title format
- Descriptive meta descriptions
- Social media optimized images
- Rich snippets via structured data
- Mobile-friendly meta tags
- Proper canonical URLs

**Accessibility Features**:
- Descriptive page titles
- Clear content descriptions
- Alt text in OG images

---

## Global Utilities

### Typography Utility Classes

Defined in `assets/base.css`:

```css
.heading-display  /* 5xl-6xl, bold, light-blue */
.heading-section  /* 4xl, bold, light-blue */
.heading-subsection  /* 2xl, semibold, cream */
.heading-card  /* xl, medium, light-blue */
```

### Print Styles

Automatic print optimization:
- Hides: navigation, search, music player, decorative lights
- Shows: link URLs (except internal anchors)
- Ensures: High contrast, readable fonts, proper page breaks
- Optimizes: Image sizing, element integrity

---

## Design Tokens Reference

### Colors (tailwind.config.js)
```javascript
primary: '#1F2B5D' (dark-blue)
primary.light: '#B2DCF4' (light-blue)
accent: '#29AFBB' (teal)
accent.hover: '#238995'
surface: '#F8FFF6' (cream)
danger: '#D70023' (dark-red)
```

### Fluid Typography Scales
```javascript
6xl: clamp(3rem, 5vw + 1rem, 4.5rem)      // 48px -> 72px
5xl: clamp(2.5rem, 4vw + 1rem, 3.75rem)   // 40px -> 60px
4xl: clamp(1.75rem, 3vw + 1rem, 2.5rem)   // 28px -> 40px
2xl: clamp(1.25rem, 2vw + 0.75rem, 1.75rem) // 20px -> 28px
xl: clamp(1.125rem, 1.5vw + 0.75rem, 1.5rem) // 18px -> 24px
```

### Animation Durations
```javascript
fast: 150ms    // Quick feedback
normal: 250ms  // Standard transitions
slow: 400ms    // Emphasized changes
```

### Spacing Scale (8px base)
```javascript
14: 3.5rem (56px)  // 7 × 8px
18: 4.5rem (72px)  // 9 × 8px
22: 5.5rem (88px)  // 11 × 8px
26: 6.5rem (104px) // 13 × 8px
```

---

## Accessibility Standards

All components follow **WCAG 2.1 Level AA** standards:

- **Contrast Ratios**: All text meets 4.5:1 minimum (many exceed 7:1 for AAA)
- **Touch Targets**: Minimum 44×44px for all interactive elements
- **Keyboard Navigation**: Full keyboard support with visible focus indicators
- **Screen Readers**: ARIA labels, roles, and live regions where appropriate
- **Motion**: Respects prefers-reduced-motion user preference
- **Focus Management**: Logical tab order and focus-visible states

---

## Development Notes

### PropTypes Installation

**Note**: Run `pnpm install` to install the `prop-types` package added to package.json.

### Testing Components

Component playground available at `/playground` (development mode only) for interactive testing of all components.

### Style Conventions

- Use semantic color names (primary, accent, surface) over descriptive colors
- Apply 8px spacing scale for consistency
- Use animation tokens (fast, normal, slow) instead of hardcoded durations
- Prefer Tailwind utilities over custom CSS
- Use heading components/utilities for consistent typography

---

## Quick Reference

**Most commonly used components**:
1. **Layout** - Wrap all pages
2. **SEO** - First component in every page
3. **Heading** - All section titles
4. **Image** - All images
5. **Bio** - Author sections

**Accessibility checklist**:
- ✅ Semantic HTML
- ✅ ARIA labels where needed
- ✅ Keyboard navigation
- ✅ Focus indicators
- ✅ 44px touch targets
- ✅ Color contrast

**Performance checklist**:
- ✅ Lazy load images
- ✅ WebP with fallbacks
- ✅ Code splitting
- ✅ Minimal dependencies
- ✅ Optimized animations
