const proxySettings = require('./proxy-settings')

/**
 * # Some notes on rewrites
 *
 * ## Why this approach works
 *
 * ### "beforeFiles"
 *
 * We run our rewrites "beforeFile". This makes it so
 * NextJS does the rewrite even if it has a page file to serve.
 * We do this because we have conflicting pages, such as:
 * - "/" (shows _secret-io-homepage, even though there is a dev-portal landing page)
 * - "/docs" (shows /waypoint/docs, even though there may be a dev-portal docs landing page)
 * - ... etc
 *
 * ref: https://nextjs.org/docs/api-reference/next.config.js/rewrites
 *
 * ## Explicit rewrites
 *
 * We current have explicit rewrites for the home page
 * as well as for all product pages (just Waypoint for now, but more to add).
 *
 * The reason for this is that regex approaches seemed
 * to consistently cause problems. Specifically:
 *
 * - Using "/:path*" without "beforeFiles"
 *   (ie default "afterFiles") means we don't
 *   resolve the conflicts mentioned above,
 *   in the "beforeFiles" section, as expected.
 *
 * - Using "/:path*" or "/:path+" with "beforeFiles"
 *   end up rewriting all `/_next/` assets.
 *   This breaks the page.
 *
 */
const productsToProxy = Object.keys(proxySettings)
const dotIoRewrites = productsToProxy.reduce((acc, productSlug) => {
  const routesToProxy = proxySettings[productSlug].routesToProxy
  // If we're trying to test this product in dev,
  // then we'll apply the rewrites without a host condition
  const isDevProduct = process.env.DEV_IO_PROXY === productSlug
  const proxyRewrites = routesToProxy.map(({ proxiedRoute, localRoute }) => {
    return {
      source: proxiedRoute,
      destination: localRoute,
      has: isDevProduct
        ? []
        : [
            {
              type: 'host',
              value: proxySettings[productSlug].host,
            },
          ],
    }
  })
  return acc.concat(proxyRewrites)
}, [])

async function rewritesConfig() {
  return {
    beforeFiles: [...dotIoRewrites],
  }
}

module.exports = rewritesConfig
