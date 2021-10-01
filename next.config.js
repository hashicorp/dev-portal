const withHashicorp = require('@hashicorp/platform-nextjs-plugin')
const withSwingset = require('swingset')

module.exports = withSwingset({ componentsRoot: 'src/components/*' })(
  withHashicorp({
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
)
