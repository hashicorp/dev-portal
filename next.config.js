const withHashicorp = require('@hashicorp/platform-nextjs-plugin')
const withSwingset = require('swingset')
const redirectsConfig = require('./config/redirects')
const rewritesConfig = require('./config/rewrites')

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
      return await redirectsConfig()
    },
    async rewrites() {
      return await rewritesConfig()
    },
    env: {
      HASHI_ENV: process.env.HASHI_ENV || 'development',
      BUGSNAG_CLIENT_KEY: '06718db5e1d75829801baa0b4ca2fb7b',
      BUGSNAG_SERVER_KEY: 'b32b4487b5dc72b32f51c8fe33641a43',
      DEV_IO_PROXY: process.env.DEV_IO_PROXY,
      IS_CONTENT_DEPLOY_PREVIEW: process.env.IS_CONTENT_DEPLOY_PREVIEW,
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
