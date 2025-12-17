import PropTypes from 'prop-types';

/**
 * Memphis-style geometric shape decorations
 * Provides various SVG shapes for playful accents
 */

// Squiggly line decoration
export function Squiggle({ color = 'currentColor', width = 100, strokeWidth = 3, className = '' }) {
  return (
    <svg
      width={width}
      height={strokeWidth + 4}
      viewBox={`0 0 ${width} ${strokeWidth + 4}`}
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d={`M 0 ${(strokeWidth + 4) / 2} Q ${width / 4} ${strokeWidth} ${width / 2} ${(strokeWidth + 4) / 2} T ${width} ${(strokeWidth + 4) / 2}`}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

Squiggle.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  strokeWidth: PropTypes.number,
  className: PropTypes.string,
};

// Scattered dots decoration
export function Dots({ color = 'currentColor', size = 60, dotSize = 8, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      aria-hidden="true"
    >
      <circle cx={dotSize} cy={dotSize} r={dotSize / 2} fill={color} opacity="0.8" />
      <circle cx={size - dotSize} cy={dotSize * 2} r={dotSize / 2} fill={color} opacity="0.6" />
      <circle cx={dotSize * 2} cy={size - dotSize} r={dotSize / 2} fill={color} opacity="0.7" />
    </svg>
  );
}

Dots.propTypes = {
  color: PropTypes.string,
  size: PropTypes.number,
  dotSize: PropTypes.number,
  className: PropTypes.string,
};

// Triangle accent
export function Triangle({
  color = 'currentColor',
  size = 40,
  rotation = 0,
  filled = true,
  className = '',
}) {
  const points = `${size / 2},0 ${size},${size} 0,${size}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ transform: `rotate(${rotation}deg)` }}
      className={className}
      aria-hidden="true"
    >
      {filled ? (
        <polygon points={points} fill={color} opacity="0.8" />
      ) : (
        <polygon points={points} fill="none" stroke={color} strokeWidth="3" />
      )}
    </svg>
  );
}

Triangle.propTypes = {
  color: PropTypes.string,
  size: PropTypes.number,
  rotation: PropTypes.number,
  filled: PropTypes.bool,
  className: PropTypes.string,
};

// Abstract blob background
export function Blob({ color = 'currentColor', size = 120, variant = 1, className = '' }) {
  const paths = {
    1: 'M60,10 C80,10 110,25 110,50 C110,75 95,100 60,100 C25,100 10,80 10,50 C10,25 35,10 60,10 Z',
    2: 'M70,15 C90,20 100,40 95,65 C90,90 65,105 40,95 C15,85 5,60 15,35 C25,10 50,10 70,15 Z',
    3: 'M50,20 C75,15 95,35 100,60 C105,85 85,105 60,105 C35,105 10,90 10,60 C10,30 25,25 50,20 Z',
  };

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className={className} aria-hidden="true">
      <path d={paths[variant] || paths[1]} fill={color} opacity="0.15" />
    </svg>
  );
}

Blob.propTypes = {
  color: PropTypes.string,
  size: PropTypes.number,
  variant: PropTypes.oneOf([1, 2, 3]),
  className: PropTypes.string,
};

// Zigzag line
export function Zigzag({
  color = 'currentColor',
  width = 80,
  height = 20,
  strokeWidth = 2,
  className = '',
}) {
  const points = `0,${height / 2} ${width / 4},0 ${width / 2},${height} ${(width * 3) / 4},0 ${width},${height / 2}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <polyline
        points={points}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

Zigzag.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  strokeWidth: PropTypes.number,
  className: PropTypes.string,
};

// Circle accent
export function Circle({
  color = 'currentColor',
  size = 30,
  filled = false,
  strokeWidth = 3,
  className = '',
}) {
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      aria-hidden="true"
    >
      {filled ? (
        <circle cx={center} cy={center} r={radius} fill={color} opacity="0.7" />
      ) : (
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
        />
      )}
    </svg>
  );
}

Circle.propTypes = {
  color: PropTypes.string,
  size: PropTypes.number,
  filled: PropTypes.bool,
  strokeWidth: PropTypes.number,
  className: PropTypes.string,
};
