import {
  Bio,
  ErrorBoundary,
  Heading,
  Image,
  Layout,
  MixCardSkeleton,
  PlaylistDisplay,
  SEO,
} from '@components/common';
import { useState } from 'react';

// Only show playground in development mode
export default function Playground() {
  if (process.env.NODE_ENV !== 'development') {
    return (
      <Layout>
        <SEO title="Page Not Found" />
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold text-light-blue mb-4">404</h1>
          <p className="text-cream text-opacity-90">
            This page is only available in development mode.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO title="Component Playground" />
      <div className="max-w-6xl mx-auto">
        <Heading level="h1" variant="display" className="mb-12">
          Component Playground
        </Heading>

        <p className="text-cream text-opacity-80 mb-12 text-lg">
          Interactive showcase of all reusable components with live examples and controls.
        </p>

        {/* Heading Component */}
        <ComponentSection title="Heading Component">
          <HeadingPlayground />
        </ComponentSection>

        {/* Bio Component */}
        <ComponentSection title="Bio Component">
          <BioPlayground />
        </ComponentSection>

        {/* Image Component */}
        <ComponentSection title="Image Component">
          <ImagePlayground />
        </ComponentSection>

        {/* Playlist Component */}
        <ComponentSection title="PlaylistDisplay Component">
          <PlaylistPlayground />
        </ComponentSection>

        {/* MixCardSkeleton Component */}
        <ComponentSection title="MixCardSkeleton Component">
          <MixCardSkeletonPlayground />
        </ComponentSection>

        {/* ErrorBoundary Component */}
        <ComponentSection title="ErrorBoundary Component">
          <ErrorBoundaryPlayground />
        </ComponentSection>

        {/* Typography Utilities */}
        <ComponentSection title="Typography Utility Classes">
          <TypographyPlayground />
        </ComponentSection>

        {/* Design Tokens */}
        <ComponentSection title="Design System Tokens">
          <DesignTokensPlayground />
        </ComponentSection>
      </div>
    </Layout>
  );
}

// Component Section Wrapper
function ComponentSection({ title, children }) {
  return (
    <section className="mb-16 p-8 rounded-lg bg-dark-blue bg-opacity-30 border border-light-blue border-opacity-20">
      <Heading level="h2" variant="section" className="mb-6">
        {title}
      </Heading>
      {children}
    </section>
  );
}

// Heading Playground
function HeadingPlayground() {
  const [level, setLevel] = useState('h2');
  const [variant, setVariant] = useState('section');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="heading-level" className="block text-cream text-sm mb-2">
            Semantic Level
          </label>
          <select
            id="heading-level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded"
          >
            {['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="heading-variant" className="block text-cream text-sm mb-2">
            Visual Variant
          </label>
          <select
            id="heading-variant"
            value={variant}
            onChange={(e) => setVariant(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded"
          >
            {['display', 'section', 'subsection', 'card'].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-6 bg-surface dark:bg-gray-900 rounded-lg">
        <Heading level={level} variant={variant}>
          Sample Heading Text
        </Heading>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Level: {level}, Variant: {variant}
        </p>
      </div>
    </div>
  );
}

// Bio Playground
function BioPlayground() {
  return (
    <div className="space-y-4">
      <p className="text-cream text-opacity-80 text-sm">
        The Bio component displays author information with profile image and social link.
      </p>
      <Bio />
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-4">
        <p>✅ Profile image hover animation</p>
        <p>✅ Instagram link with 44px touch target</p>
        <p>✅ Semantic color transitions</p>
      </div>
    </div>
  );
}

// Image Playground
function ImagePlayground() {
  return (
    <div className="space-y-4">
      <p className="text-cream text-opacity-80 text-sm mb-4">
        Optimized image component with lazy loading, WebP support, and LQIP preview.
      </p>
      <div className="max-w-sm">
        <Image
          alt="Sample Christmas playlist cover"
          src={require('../content/assets/2025.jpg')}
          webpSrc={require('../content/assets/2025.jpg?webp')}
          previewSrc={require('../content/assets/2025.jpg?lqip')}
          className="rounded-lg"
        />
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-4">
        <p>✅ Progressive loading with LQIP</p>
        <p>✅ WebP format with PNG/JPEG fallback</p>
        <p>✅ Lazy loading via lazysizes</p>
      </div>
    </div>
  );
}

// Playlist Playground
function PlaylistPlayground() {
  const sampleTracks = [
    { name: 'Silent Night', singer: 'Bing Crosby', duration: 210 },
    { name: 'White Christmas', artist: 'Bing Crosby', duration: 195 },
    { name: 'Jingle Bells', singer: 'Frank Sinatra', duration: 165 },
    { name: 'Have Yourself a Merry Little Christmas', artist: 'Judy Garland', duration: 240 },
    { name: 'Rudolph the Red-Nosed Reindeer', singer: 'Gene Autry', duration: 155 },
    { name: 'Frosty the Snowman', artist: 'Gene Autry', duration: 132 },
    { name: 'Santa Claus Is Coming to Town', singer: 'Bruce Springsteen', duration: 250 },
  ];

  return (
    <div className="space-y-4">
      <p className="text-cream text-opacity-80 text-sm">
        Tracklist display with zebra striping, visual grouping, and formatted metadata.
      </p>
      <PlaylistDisplay tracks={sampleTracks} />
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-4">
        <p>✅ Zebra striping for readability</p>
        <p>✅ Visual grouping every 5 tracks</p>
        <p>✅ Teal track numbers</p>
        <p>✅ Duration formatting</p>
      </div>
    </div>
  );
}

// MixCardSkeleton Playground
function MixCardSkeletonPlayground() {
  return (
    <div className="space-y-4">
      <p className="text-cream text-opacity-80 text-sm">
        Loading skeleton for mix cards during data fetching.
      </p>
      <MixCardSkeleton />
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-4">
        <p>✅ Pulse animation</p>
        <p>✅ Matches mix card dimensions</p>
        <p>✅ aria-busy and aria-label for accessibility</p>
      </div>
    </div>
  );
}

// ErrorBoundary Playground
function ErrorBoundaryPlayground() {
  const [shouldError, setShouldError] = useState(false);

  const BuggyComponent = () => {
    if (shouldError) {
      throw new Error('Intentional error for testing ErrorBoundary');
    }
    return <p className="text-green-500">✅ Component rendering successfully</p>;
  };

  return (
    <div className="space-y-4">
      <p className="text-cream text-opacity-80 text-sm">
        Click the button to trigger an error and see the ErrorBoundary fallback UI.
      </p>

      <button
        type="button"
        onClick={() => setShouldError(!shouldError)}
        className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-opacity-80 transition-colors"
      >
        {shouldError ? 'Reset' : 'Trigger Error'}
      </button>

      <div className="p-6 bg-surface dark:bg-gray-900 rounded-lg">
        <ErrorBoundary>
          <BuggyComponent />
        </ErrorBoundary>
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 mt-4">
        <p>✅ Catches React errors</p>
        <p>✅ Friendly fallback UI</p>
        <p>✅ Reset functionality</p>
        <p>✅ Development error details</p>
      </div>
    </div>
  );
}

// Typography Utilities Playground
function TypographyPlayground() {
  return (
    <div className="space-y-6">
      <p className="text-cream text-opacity-80 text-sm">
        Typography utility classes for use in markdown or static content.
      </p>

      <div className="space-y-4">
        <div className="p-4 bg-surface dark:bg-gray-900 rounded-lg">
          <h1 className="heading-display">Display Heading (.heading-display)</h1>
        </div>

        <div className="p-4 bg-surface dark:bg-gray-900 rounded-lg">
          <h2 className="heading-section">Section Heading (.heading-section)</h2>
        </div>

        <div className="p-4 bg-surface dark:bg-gray-900 rounded-lg">
          <h3 className="heading-subsection">Subsection Heading (.heading-subsection)</h3>
        </div>

        <div className="p-4 bg-surface dark:bg-gray-900 rounded-lg">
          <h4 className="heading-card">Card Heading (.heading-card)</h4>
        </div>
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 mt-4">
        <p>✅ Mirrors Heading component variants</p>
        <p>✅ Fluid typography with clamp()</p>
        <p>✅ Semantic color system</p>
      </div>
    </div>
  );
}

// Design Tokens Playground
function DesignTokensPlayground() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-light-blue mb-4">Color Palette</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <ColorSwatch name="Primary (Dark Blue)" color="#1F2B5D" textColor="text-cream" />
          <ColorSwatch
            name="Primary Light (Light Blue)"
            color="#B2DCF4"
            textColor="text-dark-blue"
          />
          <ColorSwatch name="Accent (Teal)" color="#29AFBB" textColor="text-white" />
          <ColorSwatch name="Accent Hover" color="#238995" textColor="text-white" />
          <ColorSwatch name="Surface (Cream)" color="#F8FFF6" textColor="text-dark-blue" />
          <ColorSwatch name="Danger (Dark Red)" color="#D70023" textColor="text-white" />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-light-blue mb-4">Animation Durations</h3>
        <div className="space-y-2 text-cream text-opacity-80 text-sm">
          <p>⚡ Fast: 150ms (quick feedback)</p>
          <p>🔄 Normal: 250ms (standard transitions)</p>
          <p>🐌 Slow: 400ms (emphasized changes)</p>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-light-blue mb-4">Spacing Scale (8px base)</h3>
        <div className="space-y-2 text-cream text-opacity-80 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-14 h-14 bg-teal rounded" />
            <span>14 = 56px (7 × 8px)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-18 h-18 bg-teal rounded" />
            <span>18 = 72px (9 × 8px)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-22 h-22 bg-teal rounded" />
            <span>22 = 88px (11 × 8px)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-26 h-26 bg-teal rounded" />
            <span>26 = 104px (13 × 8px)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Color Swatch Component
function ColorSwatch({ name, color, textColor }) {
  return (
    <div className="rounded-lg overflow-hidden border border-light-blue border-opacity-20">
      <div
        className={`h-24 ${textColor} flex items-center justify-center font-mono text-sm`}
        style={{ backgroundColor: color }}
      >
        {color}
      </div>
      <div className="p-3 bg-surface dark:bg-gray-900">
        <p className="text-sm text-gray-900 dark:text-cream">{name}</p>
      </div>
    </div>
  );
}
