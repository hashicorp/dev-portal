const withHashicorp = require('@hashicorp/platform-nextjs-plugin')
const withSwingset = require('swingset')
const redirectsConfig = require('./config/redirects/redirects.next.js')

// temporary: set all paths as noindex, until we're serving from this project
const temporary_hideDocsPaths = {
  source: '/:path*',
  headers: [
    {
      key: 'X-Robots-Tag',
      value: 'noindex',
    },
  ],
}

module.exports = withSwingset({ componentsRoot: 'src/components/*' })(
  withHashicorp({
    nextOptimizedImages: true,
    transpileModules: ['swingset'],
  })({
    async headers() {
      return [temporary_hideDocsPaths]
    },
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
