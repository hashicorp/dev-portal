const proxySettings = require('./proxy-settings')

const DEV_PORTAL_DOMAIN = 'https://hashi-dev-portal.vercel.app'

// Redirect all proxied product pages
// to the appropriate product domain
//
// Note: we do this for ALL domains, as we never want visitors to
// see the original "proxied" routes, no matter what domain they're on.
const productsToProxy = Object.keys(proxySettings)
const devPortalToDotIoRedirects = productsToProxy.reduce((acc, productSlug) => {
  const routesToProxy = proxySettings[productSlug].routesToProxy
  // If we're trying to test this product's redirects in dev,
  // then we'll set the domain to an empty string for absolute URLs
  const isDevProduct = process.env.DEV_IO_PROXY === productSlug
  const proxyDomain = isDevProduct ? '' : proxySettings[productSlug].domain
  const toDotIoRedirects = routesToProxy.map(({ proxiedRoute, localRoute }) => {
    return {
      source: localRoute,
      destination: proxyDomain + proxiedRoute,
      permanent: false,
    }
  })
  return acc.concat(toDotIoRedirects)
}, [])

// Redirect dev-portal routes to the dev-portal domain,
// if we're on the proxied domain.
//
// (Note: without these redirects, dev-portal routes will be visible and
// indexed by search engines on our proxied .io domains, which seems
// like it could cause problems)
// TODO: this is a simple single route, we'd probably want to redirect all dev-portal routes
// We could likely come up with a way to determine a full list automatically:
// 1. list all dev routes, ie everything except what's in /_proxied-dot-io/*
// 2. for each product domain, build a redirect so that when /some-dev-portal-route
//    is visited on that product domain, it redirects to dev-portal
const devPortalRoutes = ['/some-dev-portal-route']
const dotIoToDevPortalRedirects = productsToProxy.reduce((acc, productSlug) => {
  const productHost = proxySettings[productSlug].host
  const toDevPortalRedirects = devPortalRoutes.map((devPortalRoute) => {
    return {
      source: devPortalRoute,
      destination: DEV_PORTAL_DOMAIN + devPortalRoute,
      permanent: false,
      has: [
        {
          type: 'host',
          value: productHost,
        },
      ],
    }
  })
  return acc.concat(toDevPortalRedirects)
}, [])

async function redirectsConfig() {
  return [...devPortalToDotIoRedirects, ...dotIoToDevPortalRedirects]
}

module.exports = redirectsConfig
