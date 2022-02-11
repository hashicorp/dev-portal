const withHashicorp = require('@hashicorp/platform-nextjs-plugin')
const withSwingset = require('swingset')
const redirectsConfig = require('./config/redirects')
const rewritesConfig = require('./config/rewrites')

// temporary: set all paths as noindex, until we're serving from this project
// Update the excluded domains to ensure we are indexing content as the io sites get migrated
const temporary_hideDocsPaths = {
  source: '/:path*',
  headers: [
    {
      key: 'X-Robots-Tag',
      value: 'noindex',
    },
  ],
  has: [{ type: 'host', value: '(^(?!.*(nomadproject|waypointproject)).*$)' }],
}

module.exports = withSwingset({ componentsRoot: 'src/components/*' })(
  withHashicorp({
    nextOptimizedImages: true,
    css: false,
    transpileModules: [
      'swingset',
      // TODO: once Sentinel has been migrated into
      // TODO: the dev-portal repository, we should
      // TODO: consider localizing the sentinel-embedded
      // TODO: component. Should first confirm with Cam Stitt
      // TODO: that this component is not being used elsewhere.
      '@hashicorp/sentinel-embedded',
      '@hashicorp/flight-icons',
    ],
  })({
    async headers() {
      return [temporary_hideDocsPaths]
    },
    async redirects() {
      return await redirectsConfig()
    },
    async rewrites() {
      return await rewritesConfig()
    },
    env: {
      HASHI_ENV: process.env.HASHI_ENV || 'development',
      BUGSNAG_CLIENT_KEY: '06718db5e1d75829801baa0b4ca2fb7b',
      BUGSNAG_SERVER_KEY: 'b32b4487b5dc72b32f51c8fe33641a43',
      ENABLE_VERSIONED_DOCS: process.env.ENABLE_VERSIONED_DOCS || false,
      IS_CONTENT_PREVIEW: process.env.IS_CONTENT_PREVIEW,
      DEV_IO: process.env.DEV_IO,
    },
    svgo: {
      plugins: [
        {
          removeViewBox: false,
          collapseGroups: false,
        },
      ],
    },
    outputFileTracing: false,
  })
)
