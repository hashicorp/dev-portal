const withHashicorp = require('@hashicorp/platform-nextjs-plugin')
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
