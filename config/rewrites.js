// const proxiedPages = require('./proxied-pages.json')

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
 * - Using "/:path*" would not match the home page.
 *   Using it alongside an explicit home page rewrite
 *   did not result in the expected behaviour.
 *
 * - Using "/:path+" alongside the an explicit home page
 *   rewrite should work in theory. But, this method seems
 *   to end up rewriting all `/_next/` assets, which
 *   completely breaks the page. And, as with "/:path*",
 *   in practice the home page rewrite didn't work anyways
 *   (resulted in a 404, with no styles or JS loading).
 *
 */

async function rewritesConfig() {
  return {
    beforeFiles: [
      // {
      //   source: '/',
      //   destination: '/waypoint/_secret-io-homepage',
      //   has: [
      //     {
      //       type: 'host',
      //       value: 'wp.snarglepuss.com',
      //     },
      //   ],
      // },
      {
        source: '/:path*',
        destination: '/waypoint/:path*',
        // has: [
        //   {
        //     type: 'host',
        //     value: 'wp.snarglepuss.com',
        //   },
        // ],
      },
    ],
  }
}

module.exports = rewritesConfig
