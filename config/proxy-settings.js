const path = require('path')
const klawSync = require('klaw-sync')

function gatherRoutesToProxy(pagesDir) {
  const targetDir = path.resolve(`./src/pages${pagesDir}`)
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
      const projectPage = `${pagesDir}${
        proxiedRoute == '/' ? '' : proxiedRoute
      }`
      return {
        proxiedRoute,
        projectPage,
      }
    })
    .sort((aObj, bObj) => {
      const a = aObj.proxiedRoute
      const b = bObj.proxiedRoute
      return a < b ? -1 : a > b ? 1 : 0
    })
  return routesToProxy
}

module.exports = {
  boundary: {
    // actually https://boundaryproject.io, but using test-bd.hashi-mktg.com as a test
    domain: 'https://test-bd.hashi-mktg.com',
    host: 'test-bd.hashi-mktg.com',
    routesToProxy: gatherRoutesToProxy('/_proxied-dot-io/boundary'),
  },
  waypoint: {
    // actually https://waypointproject.io, but using wp.snarglepuss.com as a test
    domain: 'https://wp.snarglepuss.com',
    host: 'wp.snarglepuss.com',
    routesToProxy: gatherRoutesToProxy('/_proxied-dot-io/waypoint'),
  },
}
