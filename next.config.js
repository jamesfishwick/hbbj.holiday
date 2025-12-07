// next.config.js
const withOptimizedImages = require('next-optimized-images');

const imageOptimizationConfig = {
  handleImages: ['jpeg', 'jpg', 'png', 'gif'],
  responsive: {
    adapter: require('responsive-loader/sharp'),
  },
  optimizeImages: false, // Disabled for Netlify build compatibility
};

module.exports = withOptimizedImages({
  ...imageOptimizationConfig,
  images: {
    disableStaticImages: true,
  },
});
