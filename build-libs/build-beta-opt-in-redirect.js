const { unflatten } = require('flat')
const { loadHashiConfigForEnvironment } = require('../config')
// const proxySettings = require('./proxy-settings')

const __config = unflatten(loadHashiConfigForEnvironment())

/**
 * Construct a redirect definition for beta product opt-in, based on cookies and host conditions
 *
 * @param {*} product  string
 * @param {*} basePaths string[]
 * @returns {Redirect} redirect
 */
function buildBetaProductOptInRedirect(product, basePaths) {
  return {
    source: `/:base(${basePaths.join('|')})/:path*`,
    destination: `${__config.dev_dot.canonical_base_url}/${product}/:base/:path*`,
    permanent: false,
    has: [
      {
        type: 'cookie',
        key: `${product}-io-beta-opt-in`,
        value: 'true',
      },
      {
        type: 'cookie',
        key: 'io_preview',
        value: product,
      },
      // {
      //   type: 'host',
      //   value: proxySettings[product].host,
      // },
    ],
  }
}

module.exports = buildBetaProductOptInRedirect
