const withHashicorp = require('@hashicorp/platform-nextjs-plugin')
const withSwingset = require('swingset')
const redirectsConfig = require('./config/redirects/redirects.next.js')

module.exports = withSwingset({ componentsRoot: 'src/components/*' })(
  withHashicorp({
    nextOptimizedImages: true,
    transpileModules: ['swingset'],
  })({
    async redirects() {
      return redirectsConfig
    },
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
