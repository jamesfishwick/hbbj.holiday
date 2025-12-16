import PropTypes from 'prop-types';

/**
 * Memphis-style chunky badge for highlighting interesting metadata
 * Features thick borders, playful rotation, and geometric shapes
 */
export default function MetadataBadge({
  children,
  shape = 'rounded',
  rotation = 0,
  className = '',
}) {
  const shapeClasses = {
    rounded: 'rounded-lg',
    pentagon: 'clip-pentagon',
    pill: 'rounded-full',
  };

  return (
    <span
      className={`
        inline-block
        px-3 py-1.5
        bg-teal text-dark-blue
        border-3 border-dark-blue
        font-bold text-xs uppercase tracking-wide
        transition-all duration-200
        hover:scale-105 hover:shadow-lg
        cursor-default
        ${shapeClasses[shape] || shapeClasses.rounded}
        ${className}
      `}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {children}
    </span>
  );
}

MetadataBadge.propTypes = {
  children: PropTypes.node.isRequired,
  shape: PropTypes.oneOf(['rounded', 'pentagon', 'pill']),
  rotation: PropTypes.number,
  className: PropTypes.string,
};
