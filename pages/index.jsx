import {
  Bio,
  Blob,
  Circle,
  Dots,
  Image,
  Layout,
  MetadataBadge,
  SEO,
  Squiggle,
  Triangle,
} from '@components/common';
import { extractMetadata } from '@utils/extractMetadata';
import { getSortedMixes } from '@utils/mixes';
import Link from 'next/link';

// Seeded random number generator for deterministic randomness
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate random decorations using Bridson's Poisson Disk Sampling algorithm
// Guarantees minimum distance between points for even distribution
function getCardDecorations(index) {
  const _shapes = [];
  const shapeSize = 2; // Average shape size in percentage (converted from ~20px)
  const minDistance = 3; // Minimum distance between shape edges (in percentage)
  const k = 30; // Number of attempts before rejecting a point
  const width = 100;
  const height = 100;

  // Base shape types - ensure each appears at least once
  const baseShapeTypes = [
    { component: Circle, props: (size) => ({ size, filled: false, strokeWidth: 3 }) },
    {
      component: Triangle,
      props: (size) => ({
        size,
        rotation: Math.floor(seededRandom(index * 17) * 360),
        filled: false,
      }),
    },
    { component: Blob, props: (size) => ({ size, variant: 1 }) },
    { component: Squiggle, props: (size) => ({ width: size, strokeWidth: 2 }) },
    { component: Dots, props: (size) => ({ size, dotSize: Math.max(4, size / 8) }) },
  ];

  // Weighted shape selection with cumulative probabilities
  // Circles: 30%, Triangles: 30%, Blobs: 20%, Squiggles: 10%, Dots: 10%
  const getWeightedShape = (seedValue) => {
    const rand = seededRandom(seedValue);

    if (rand < 0.3) {
      // Circle (30%)
      return {
        component: Circle,
        props: (size) => ({ size, filled: seededRandom(seedValue * 13) > 0.5, strokeWidth: 3 }),
      };
    } else if (rand < 0.6) {
      // Triangle (30%)
      return {
        component: Triangle,
        props: (size) => ({
          size,
          rotation: Math.floor(seededRandom(seedValue * 17) * 360),
          filled: seededRandom(seedValue * 19) > 0.5,
        }),
      };
    } else if (rand < 0.8) {
      // Blob (20%)
      return {
        component: Blob,
        props: (size) => ({ size, variant: Math.floor(seededRandom(seedValue * 23) * 3) + 1 }),
      };
    } else if (rand < 0.9) {
      // Squiggle (10%)
      return { component: Squiggle, props: (size) => ({ width: size, strokeWidth: 2 }) };
    } else {
      // Dots (10%)
      return { component: Dots, props: (size) => ({ size, dotSize: Math.max(4, size / 8) }) };
    }
  };

  const colors = ['#B2DCF4', '#29AFBB'];
  const _opacityClasses = ['opacity-10', 'opacity-15', 'opacity-20'];

  // Bridson's Poisson Disk Sampling with shape size consideration
  const effectiveMinDist = minDistance + shapeSize * 2; // Account for shape radii
  const cellSize = effectiveMinDist / Math.sqrt(2);
  const cols = Math.ceil(width / cellSize);
  const rows = Math.ceil(height / cellSize);
  const grid = new Array(cols * rows).fill(null);
  const active = [];
  const points = [];

  // Helper to get grid index
  const getGridIndex = (x, y) => {
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    if (col < 0 || col >= cols || row < 0 || row >= rows) return -1;
    return col + row * cols;
  };

  // Helper to check if point is valid (checking edge-to-edge distance)
  const isValidPoint = (x, y) => {
    // Keep shapes away from edges
    if (x < shapeSize || x >= width - shapeSize || y < shapeSize || y >= height - shapeSize)
      return false;

    const gridIndex = getGridIndex(x, y);
    if (gridIndex === -1) return false;

    // Check neighboring cells
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    for (let i = -2; i <= 2; i++) {
      for (let j = -2; j <= 2; j++) {
        const neighborCol = col + i;
        const neighborRow = row + j;
        if (neighborCol >= 0 && neighborCol < cols && neighborRow >= 0 && neighborRow < rows) {
          const neighborIndex = neighborCol + neighborRow * cols;
          const neighbor = grid[neighborIndex];
          if (neighbor !== null) {
            const dx = x - neighbor.x;
            const dy = y - neighbor.y;
            const centerDistance = Math.sqrt(dx * dx + dy * dy);
            // Check edge-to-edge distance (center distance minus both radii)
            if (centerDistance < effectiveMinDist) return false;
          }
        }
      }
    }
    return true;
  };

  // Start with multiple seed points distributed across the full area
  let seedCounter = index * 997;

  // Create 5 initial seed points in different regions to ensure full coverage
  const seedPoints = [
    { x: 15 + seededRandom(seedCounter++) * 20, y: 15 + seededRandom(seedCounter++) * 20 }, // Top-left
    { x: 65 + seededRandom(seedCounter++) * 20, y: 15 + seededRandom(seedCounter++) * 20 }, // Top-right
    { x: 40 + seededRandom(seedCounter++) * 20, y: 40 + seededRandom(seedCounter++) * 20 }, // Center
    { x: 15 + seededRandom(seedCounter++) * 20, y: 65 + seededRandom(seedCounter++) * 20 }, // Bottom-left
    { x: 65 + seededRandom(seedCounter++) * 20, y: 65 + seededRandom(seedCounter++) * 20 }, // Bottom-right
  ];

  seedPoints.forEach((point) => {
    if (isValidPoint(point.x, point.y)) {
      points.push(point);
      active.push(point);
      grid[getGridIndex(point.x, point.y)] = point;
    }
  });

  // Generate points
  while (active.length > 0 && points.length < 89) {
    const randomIndex = Math.floor(seededRandom(seedCounter++) * active.length);
    const point = active[randomIndex];
    let found = false;

    for (let n = 0; n < k; n++) {
      // Generate point in annulus between effectiveMinDist and 2*effectiveMinDist
      const angle = seededRandom(seedCounter++) * Math.PI * 2;
      const radius = effectiveMinDist + seededRandom(seedCounter++) * effectiveMinDist;
      const newX = point.x + Math.cos(angle) * radius;
      const newY = point.y + Math.sin(angle) * radius;

      if (isValidPoint(newX, newY)) {
        const newPoint = { x: newX, y: newY };
        points.push(newPoint);
        active.push(newPoint);
        grid[getGridIndex(newX, newY)] = newPoint;
        found = true;
        break;
      }
    }

    if (!found) {
      active.splice(randomIndex, 1);
    }
  }

  // Convert points to SVG shapes
  // Render all shapes in a single SVG container for better performance
  const svgShapes = points.map((point, i) => {
    // Create a unique key based on position and index to avoid React warnings
    const key = `shape-${Math.round(point.x * 10)}-${Math.round(point.y * 10)}-${i}`;

    // Round coordinates to avoid hydration mismatches
    const xPos = Math.round(point.x * 100) / 100;
    const yPos = Math.round(point.y * 100) / 100;
    const size = 2 + Math.floor(seededRandom(index * 43 + i * 47) * 4); // 2-6 units in 0-100 viewBox
    const opacity = [0.1, 0.15, 0.2][Math.floor(seededRandom(index * 59 + i * 61) * 3)];

    // Use base types for first 5 shapes, then weighted selection
    const shapeType =
      i < baseShapeTypes.length ? baseShapeTypes[i] : getWeightedShape(index * 29 + i * 37);

    const color = colors[Math.floor(seededRandom(index * 41 + i * 43) * colors.length)];
    const filled = seededRandom(index * 13 + i * 19) > 0.5;
    const rotation = Math.floor(seededRandom(index * 17 + i * 23) * 360);
    const variant = Math.floor(seededRandom(index * 23 + i * 29) * 3) + 1;

    // Generate SVG element based on shape type
    if (shapeType.component === Circle) {
      const radius = size / 2;
      return filled ? (
        <circle key={key} cx={xPos} cy={yPos} r={radius} fill={color} opacity={opacity * 0.7} />
      ) : (
        <circle
          key={key}
          cx={xPos}
          cy={yPos}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="0.3"
          opacity={opacity}
        />
      );
    }

    if (shapeType.component === Triangle) {
      const half = size / 2;
      const points = `${xPos},${yPos - half} ${xPos + half},${yPos + half} ${xPos - half},${yPos + half}`;
      return filled ? (
        <polygon
          key={key}
          points={points}
          fill={color}
          opacity={opacity * 0.8}
          transform={`rotate(${rotation} ${xPos} ${yPos})`}
        />
      ) : (
        <polygon
          key={key}
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="0.3"
          opacity={opacity}
          transform={`rotate(${rotation} ${xPos} ${yPos})`}
        />
      );
    }

    if (shapeType.component === Blob) {
      const scale = Math.round((size / 120) * 1000) / 1000;
      const paths = {
        1: 'M60,10 C80,10 110,25 110,50 C110,75 95,100 60,100 C25,100 10,80 10,50 C10,25 35,10 60,10 Z',
        2: 'M70,15 C90,20 100,40 95,65 C90,90 65,105 40,95 C15,85 5,60 15,35 C25,10 50,10 70,15 Z',
        3: 'M50,20 C75,15 95,35 100,60 C105,85 85,105 60,105 C35,105 10,90 10,60 C10,30 25,25 50,20 Z',
      };
      return (
        <path
          key={key}
          d={paths[variant]}
          fill={color}
          opacity={opacity * 0.15}
          transform={`translate(${xPos - 60 * scale} ${yPos - 60 * scale}) scale(${scale})`}
        />
      );
    }

    if (shapeType.component === Squiggle) {
      const width = size;
      const height = 0.6;
      const pathD = `M ${xPos} ${yPos} Q ${xPos + width / 4} ${yPos - height} ${xPos + width / 2} ${yPos} T ${xPos + width} ${yPos}`;
      return (
        <path
          key={key}
          d={pathD}
          stroke={color}
          strokeWidth="0.2"
          fill="none"
          opacity={opacity}
          strokeLinecap="round"
        />
      );
    }

    if (shapeType.component === Dots) {
      const dotSize = Math.max(0.4, size / 8);
      return (
        <g key={key} opacity={opacity}>
          <circle
            cx={xPos + dotSize}
            cy={yPos + dotSize}
            r={dotSize / 2}
            fill={color}
            opacity="0.8"
          />
          <circle
            cx={xPos + size - dotSize}
            cy={yPos + dotSize * 2}
            r={dotSize / 2}
            fill={color}
            opacity="0.6"
          />
          <circle
            cx={xPos + dotSize * 2}
            cy={yPos + size - dotSize}
            r={dotSize / 2}
            fill={color}
            opacity="0.7"
          />
        </g>
      );
    }

    // Default return for unknown shape types
    return null;
  });

  return (
    <svg
      className="absolute inset-0 pointer-events-none -z-10"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      style={{ width: '100%', height: '100%' }}
      aria-hidden="true"
    >
      {svgShapes}
    </svg>
  );
}

// Get card variant based on index
function getCardVariant(index) {
  const borderStyles = [
    'border-light-blue border-opacity-20',
    'border-teal border-opacity-30',
    'border-light-blue border-opacity-25',
  ];

  const badgeRotations = [-1.5, 2, -2.5];

  return {
    decorations: getCardDecorations(index),
    badgeRotation: badgeRotations[index % badgeRotations.length],
    borderStyle: borderStyles[index % borderStyles.length],
  };
}

export default function Home({ mixes }) {
  return (
    <Layout>
      <SEO
        title="Best Christmas Music Playlists 2006-2024 | Curated Holiday Songs"
        description="Stream the ultimate collection of Christmas music playlists from 2006 to 2024. Discover handpicked holiday hits, classic carols, indie Christmas songs, and hidden festive gems. Curated annually by Sir Lord Selector for the perfect seasonal soundtrack."
      />
      <Bio className="my-14" />
      {mixes.map(({ frontmatter: { title, description }, slug, content }, index) => {
        const cardVariant = getCardVariant(index);

        return (
          <article
            key={slug}
            className={`relative mb-8 rounded-lg border ${cardVariant.borderStyle} hover:border-opacity-40 hover:bg-dark-blue hover:bg-opacity-30 shadow-md hover:shadow-xl transform hover:scale-102 transition-all duration-normal focus-within:ring-2 focus-within:ring-accent overflow-hidden`}
            aria-labelledby={`mix-title-${slug}`}
          >
            <Link href={'/mix/[slug]'} as={`/mix/${slug}`}>
              <a className="block focus:outline-none group">
                <div className="relative overflow-hidden">
                  <Image
                    alt={`Happy Birthday Baby Jesus ${title} Christmas Music Playlist - Curated Holiday Songs`}
                    src={require(`../content/assets/${title}.jpg`)}
                    webpSrc={require(`../content/assets/${title}.jpg?webp`)}
                    previewSrc={require(`../content/assets/${title}.jpg?lqip`)}
                    className="w-full max-h-[736px] object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4">
                    <MetadataBadge shape="rounded" rotation={cardVariant.badgeRotation}>
                      {title}
                    </MetadataBadge>
                  </div>
                </div>
                <div className="relative p-6 overflow-hidden">
                  {/* Memphis decorations distributed across text area */}
                  {cardVariant.decorations}

                  <h3
                    id={`mix-title-${slug}`}
                    className="text-4xl font-bold font-display text-light-blue mb-3 relative z-10"
                  >
                    {title}
                  </h3>

                  {/* Metadata badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {extractMetadata(description, content).map((badge, badgeIndex) => {
                      // Deterministic rotation based on badge index
                      const rotations = [-1.5, 2, -2.5, 1.5];
                      const badgeRotation = rotations[badgeIndex % rotations.length];

                      return (
                        <MetadataBadge key={badge} shape="rounded" rotation={badgeRotation}>
                          {badge}
                        </MetadataBadge>
                      );
                    })}
                  </div>

                  {/* Description */}
                  <p className="text-lg text-cream text-opacity-90 leading-relaxed inline-block">
                    {description}
                  </p>
                </div>
              </a>
            </Link>
          </article>
        );
      })}
    </Layout>
  );
}

export async function getStaticProps() {
  const mixes = await getSortedMixes();

  return {
    props: {
      mixes,
    },
  };
}
