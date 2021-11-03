const path = require('path')
const klawSync = require('klaw-sync')

const targetProduct = 'boundary'
const proxyDirname = '_proxied-dot-io'
// TODO: repeat below for each product
const pagesDir = `/${proxyDirname}/${targetProduct}`
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
    const projectPage = `${pagesDir}${proxiedRoute == '/' ? '' : proxiedRoute}`
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
console.log(routesToProxy)

module.exports = {
  boundary: {
    // actually https://boundaryproject.io, but using test-bd.hashi-mktg.com as a test
    domain: 'https://test-bd.hashi-mktg.com',
    host: 'test-bd.hashi-mktg.com',
    routesToProxy,
  },
  waypoint: {
    // actually https://waypointproject.io, but using wp.snarglepuss.com as a test
    domain: 'https://wp.snarglepuss.com',
    host: 'wp.snarglepuss.com',
    routesToProxy: [
      {
        proxiedRoute: '/',
        projectPage: '/waypoint/_secret-io-homepage',
      },
      {
        proxiedRoute: '/commands/:path*',
        projectPage: '/waypoint/commands/:path*',
      },
      {
        proxiedRoute: '/community',
        projectPage: '/waypoint/community',
      },
      {
        proxiedRoute: '/docs/:path*',
        projectPage: '/waypoint/docs/:path*',
      },
      {
        proxiedRoute: '/downloads',
        projectPage: '/waypoint/downloads',
      },
      {
        proxiedRoute: '/plugins/:path*',
        projectPage: '/waypoint/plugins/:path*',
      },
      {
        proxiedRoute: '/security',
        projectPage: '/waypoint/security',
      },
      {
        proxiedRoute: '/terms',
        projectPage: '/waypoint/terms',
      },
    ],
  },
}
