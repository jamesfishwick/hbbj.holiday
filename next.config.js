// next.config.js
const withOptimizedImages = require('next-optimized-images');

const imageOptimizationConfig = {
  handleImages: ['jpeg', 'jpg', 'png', 'gif'],
  responsive: {
    adapter: require('responsive-loader/sharp'),
  },
  optimizeImages: true,
};

module.exports = withOptimizedImages({
  ...imageOptimizationConfig,
  images: {
    disableStaticImages: true,
  },
  output: 'export',
});
