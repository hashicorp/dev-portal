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
const waypointHost = proxySettings.waypoint.host
const waypointDomain = proxySettings.waypoint.domain
const waypointProxyRedirects = proxySettings.waypoint.routesToProxy
  .map(({ proxiedRoute, projectPage }) => {
    return {
      source: projectPage,
      destination: waypointDomain + proxiedRoute,
      permanent: false,
    }
  })
  // If the route in question is NOT something we want
  // to show on the proxied domain, then we should
  // redirect to the live dev portal domain
  // TODO: this is a simple single route, we'd probably want to redirect all dev-portal routes
  // (also this may be totally unnecessary if .io homepages are isolated on a separate branch,
  // which will be our default assumption - silo-ing things seem safer. We could figure
  // out a better strategy for these redirects if EVERYTHING, ie new dev-portally stuff and
  // existing pages to be proxy-served through .io domains, is to live on one branch)
  .concat([
    {
      source: '/some-dev-portal-route',
      destination: DEV_PORTAL_DOMAIN + '/some-dev-portal-route',
      permanent: false,
    },
  ])
  // For all these redirects, we want them to
  // be specific to the Waypoint site hostname
  .map((redirect) => {
    return {
      ...redirect,
      has: [
        {
          type: 'host',
          value: waypointHost,
        },
      ],
    }
  })

async function redirectsConfig() {
  return [...waypointProxyRedirects]
}

module.exports = redirectsConfig
