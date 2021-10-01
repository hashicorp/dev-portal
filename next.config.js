const withHashicorp = require('@hashicorp/platform-nextjs-plugin')
<<<<<<< HEAD
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
=======
const redirectsConfig = require('./config/redirects/redirects.next.js')

module.exports = withHashicorp({ nextOptimizedImages: true })({
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
>>>>>>> 19a44f3 (add redirect for /:product/_secret-homepage on prod environments (#5))
