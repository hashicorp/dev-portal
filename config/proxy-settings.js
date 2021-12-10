const fs = require('fs')
const path = require('path')
const klawSync = require('klaw-sync')
const proxyConfig = require('./proxy-config')

module.exports = {
  boundary: {
    domain: proxyConfig.boundary.domain,
    host: proxyConfig.boundary.host,
    routesToProxy: [
      ...gatherRoutesToProxy('/_proxied-dot-io/boundary'),
      ...buildAssetRoutesToProxy(proxyConfig.boundary.assets, '/boundary'),
    ],
  },
  waypoint: {
    domain: proxyConfig.waypoint.domain,
    host: proxyConfig.waypoint.host,
    routesToProxy: [
      ...gatherRoutesToProxy('/_proxied-dot-io/waypoint'),
      ...buildAssetRoutesToProxy(proxyConfig.waypoint.assets, '/waypoint'),
    ],
  },
  sentinel: {
    domain: proxyConfig.sentinel.domain,
    host: proxyConfig.sentinel.host,
    routesToProxy: [
      ...gatherRoutesToProxy('/_proxied-dot-io/sentinel'),
      ...buildAssetRoutesToProxy(proxyConfig.sentinel.assets, '/sentinel'),
    ],
  },
}

function buildAssetRoutesToProxy(assetPaths, localAssetsDir) {
  return assetPaths.map((proxiedRoute) => ({
    proxiedRoute: proxiedRoute,
    localRoute: `${localAssetsDir}${proxiedRoute}`,
  }))
}

/**
 * Given a directory of pages to proxy,
 * returns an array of { proxiedRoute, localRoute } objects,
 * which can be used to construct the necessary
 * redirects and rewrites.
 *
 * @param {*} pagesDir
 * @returns
 */
function gatherRoutesToProxy(pagesDir) {
  const targetDir = path.resolve(`./src/pages${pagesDir}`)
  if (!fs.existsSync(targetDir)) return []
  const pageExtensions = ['tsx', 'ts', 'jsx', 'js']
  const pageFilePaths = klawSync(targetDir)
  const routesToProxy = pageFilePaths
    .filter((file) => {
      const extension = path.extname(file.path).slice(1)
      const isPage = pageExtensions.indexOf(extension) != -1
      return isPage
    })
    .map((file) => {
      const extension = path.extname(file.path)
      const basename = path.basename(file.path, extension)
      const isDynamic = basename.slice(0, 1) == '['
      const parentDirRoute = path.relative(targetDir, path.dirname(file.path))
      const urlPath =
        basename === 'index' || isDynamic
          ? parentDirRoute
          : path.join(parentDirRoute, basename)
      const proxiedRoute = `/${urlPath}${isDynamic ? '/:path*' : ''}`
      const localRoute = `${pagesDir}${proxiedRoute == '/' ? '' : proxiedRoute}`
      return {
        proxiedRoute,
        localRoute,
      }
    })
    .sort((aObj, bObj) => {
      const a = aObj.proxiedRoute
      const b = bObj.proxiedRoute
      return a < b ? -1 : a > b ? 1 : 0
    })
  return routesToProxy
}
