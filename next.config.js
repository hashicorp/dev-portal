const fs = require('fs')
const path = require('path')
const flat = require('flat')
const { webpack } = require('next/dist/compiled/webpack/webpack')
const withHashicorp = require('@hashicorp/platform-nextjs-plugin')
const withSwingset = require('swingset')
// const redirectsConfig = require('./config/redirects')
// const rewritesConfig = require('./config/rewrites')

// temporary: set all paths as noindex, until we're serving from this project
const temporary_hideDocsPaths = {
  source: '/:path*{/}?',
  headers: [
    {
      key: 'X-Robots-Tag',
      value: 'noindex',
    },
  ],
}

/**
 * Reads in config files from config/[env].json and replaces references in the code
 * with the literal values using webpack.DefinePlugin
 */
function HashiConfigPlugin() {
  const env = process.env.HASHI_ENV || 'development'
  const envConfigPath = path.join(process.cwd(), 'config', `${env}.json`)

  function getHashiConfig(path) {
    try {
      const envConfig = JSON.parse(fs.readFileSync(path))
      const ret = flat(envConfig, {
        safe: true,
      })
      return ret
    } catch (err) {
      console.log('Error loading environment config:', err)
      return {}
    }
  }

  return new webpack.DefinePlugin({
    ...Object.fromEntries(
      Object.entries(getHashiConfig(envConfigPath)).map(([key]) => {
        return [
          `__config.${key}`,
          webpack.DefinePlugin.runtimeValue(
            () => {
              return JSON.stringify(getHashiConfig(envConfigPath)[key])
            },
            { fileDependencies: [envConfigPath] }
          ),
        ]
      })
    ),
  })
}

module.exports = withSwingset({
  componentsRoot: 'src/components/*',
  docsRoot: 'src/swingset-docs/*',
})(
  withHashicorp({
    nextOptimizedImages: true,
    transpileModules: [
      'swingset',
      '@hashicorp/flight-icons',
      '@hashicorp/sentinel-embedded',
      'unist-util-visit',
    ],
  })({
    webpack(config) {
      config.plugins.push(HashiConfigPlugin())
      return config
    },
    async headers() {
      return [temporary_hideDocsPaths]
    },
    /**
     * Commented out for the assembly-ui-v1 branch
     */
    // async redirects() {
    //   return await redirectsConfig()
    // },
    // async rewrites() {
    //   return await rewritesConfig()
    // },
    env: {
      AXE_ENABLED: process.env.AXE_ENABLED || false,
      HASHI_ENV: process.env.HASHI_ENV || 'development',
      BUGSNAG_CLIENT_KEY: '06718db5e1d75829801baa0b4ca2fb7b',
      BUGSNAG_SERVER_KEY: 'b32b4487b5dc72b32f51c8fe33641a43',
      SEGMENT_WRITE_KEY: process.env.SEGMENT_WRITE_KEY,
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
