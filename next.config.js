// next.config.js
const withOptimizedImages = require('next-optimized-images');

const imageOptimizationConig = {
  handleImages: ['jpeg', 'jpg', 'png', 'gif'],
  // ...other options
};

module.exports = withOptimizedImages({
  ...imageOptimizationConig,
  images: {
    disableStaticImages: true
  }
});