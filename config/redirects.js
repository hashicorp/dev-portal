const proxySettings = require('./proxy-settings')

const DEV_PORTAL_DOMAIN = 'https://hashi-dev-portal.vercel.app'

// Redirect all proxied Waypoint pages
// to the Waypoint project domain
// (we do this regardless of which domain we're serving from)
// TODO: should work for all routes on all products
// for now, just testing for manually specific waypoint routes...
// 2. expand to all routes for all products
// 3. find way to abstract the above so it's not repetitive, if it makes sense
//    ... maybe read in from pages folder or something, if that makes sense?
// TODO: we want to apply these redirects on the live site, but not in local dev
// one way to achieve this would be with a "has" entry. However, for local dev
// we'll likely be doing other env-based stuff, so it may be easier to just remove
// these redirects in dev rather than list specific production hosts.
// Note: we do this for ALL hosts, as we never want visitors to
// see the original "proxied" routes, no matter what domain they're on.
const DEV_IO_PROXY = process.env.DEV_IO_PROXY
const productsToProxy = Object.keys(proxySettings)
//
const devPortalToDotIoRedirects = productsToProxy.reduce((acc, productSlug) => {
  const routesToProxy = proxySettings[productSlug].routesToProxy
  // if we're trying to test this product's redirects in dev,
  // then we'll set the domain to an empty string for absolute URLs
  const isDevProduct = DEV_IO_PROXY === productSlug
  const proxyDomain = isDevProduct ? '' : proxySettings[productSlug].domain
  const toProductRedirects = routesToProxy.map(
    ({ proxiedRoute, projectPage }) => {
      return {
        source: projectPage,
        destination: proxyDomain + proxiedRoute,
        permanent: false,
      }
    }
  )
  return acc.concat(toProductRedirects)
}, [])
// Separate set of redirects:
// If the route in question is NOT something we want
// to show on the proxied domain, then we should
// redirect to the live dev portal domain
// TODO: this is a simple single route, we'd probably want to redirect all dev-portal routes
// (also this may be totally unnecessary if .io homepages are isolated on a separate branch,
// which will be our default assumption - silo-ing things seem safer. We could figure
// out a better strategy for these redirects if EVERYTHING, ie new dev-portally stuff and
// existing pages to be proxy-served through .io domains, is to live on one branch)
const devPortalRoutes = ['/some-dev-portal-route']
// For all these redirects, we want them to
// be specific to the Waypoint site hostname
const waypointToDevRedirects = devPortalRoutes.map((devPortalRoute) => {
  return {
    source: devPortalRoute,
    destination: DEV_PORTAL_DOMAIN + devPortalRoute,
    permanent: false,
    has: [
      {
        type: 'host',
        value: proxySettings.waypoint.host,
      },
    ],
  }
})

async function redirectsConfig() {
  return [
    // ...devPortalToWaypointRedirects,
    ...devPortalToDotIoRedirects,
    ...waypointToDevRedirects,
  ]
}

module.exports = redirectsConfig
