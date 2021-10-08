const withHashicorp = require('@hashicorp/platform-nextjs-plugin')
const withSwingset = require('swingset')
// const redirectsConfig = require('./config/redirects/redirects.next.js')
// const rewritesConfig = require('./config/redirects/rewrites.next.js')

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
    async rewrites() {
      return [
        { source: '/', destination: '/waypoint' }, // does not match localhost:3000
        {
          source: '/:path*{/}?', // does not match localhost:3000, but matches other routes
          destination: '/waypoint/:path*'
        },
      ]
    },
    env: {
      HASHI_ENV: process.env.HASHI_ENV || 'development',
      BUGSNAG_CLIENT_KEY: '06718db5e1d75829801baa0b4ca2fb7b',
      BUGSNAG_SERVER_KEY: 'b32b4487b5dc72b32f51c8fe33641a43',
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
