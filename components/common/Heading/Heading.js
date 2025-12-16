import clsx from 'clsx';
import PropTypes from 'prop-types';

/**
 * Semantic heading component with consistent styling and accessibility
 *
 * @param {Object} props
 * @param {'h1'|'h2'|'h3'|'h4'|'h5'|'h6'} props.level - Semantic heading level (required)
 * @param {'display'|'section'|'subsection'|'card'} props.variant - Visual style variant
 * @param {string} props.className - Additional classes
 * @param {React.ReactNode} props.children - Heading content
 */
export function Heading({ level = 'h2', variant = 'section', className, children, ...props }) {
  const Tag = level;

  const baseStyles = 'font-display';

  const variantStyles = {
    display: 'text-5xl sm:text-6xl font-bold text-light-blue mb-6',
    section: 'text-4xl font-bold text-light-blue mb-4',
    subsection: 'text-2xl font-semibold text-cream mb-3',
    card: 'text-xl font-medium text-light-blue mb-2',
  };

  return (
    <Tag className={clsx(baseStyles, variantStyles[variant], className)} {...props}>
      {children}
    </Tag>
  );
}

Heading.propTypes = {
  level: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
  variant: PropTypes.oneOf(['display', 'section', 'subsection', 'card']),
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Heading.defaultProps = {
  level: 'h2',
  variant: 'section',
  className: '',
};

export default Heading;
