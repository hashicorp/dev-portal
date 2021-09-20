const withHashicorp = require('@hashicorp/platform-nextjs-plugin')

module.exports = withHashicorp({ nextOptimizedImages: true })({
  svgo: {
    plugins: [
      {
        removeViewBox: false,
        collapseGroups: false,
      },
    ],
  },
})
