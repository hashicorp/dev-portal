const withHashicorp = require('@hashicorp/platform-nextjs-plugin')

module.exports = withHashicorp({
  nextOptimizedImages: true,
  transpileModules: ['swingset'],
})({
  svgo: {
    plugins: [
      {
        removeViewBox: false,
        collapseGroups: false,
      },
    ],
  },
})
