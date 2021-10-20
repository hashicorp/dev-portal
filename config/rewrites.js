async function rewritesConfig() {
  return {
    // We run our rewrites BEFORE letting NextJS check if there
    // is a /pages file to be served, since there are conflicts, for example:
    // - "/" should show _secret-io-homepage, even though there is a dev-portal landing page
    // - "/docs" should show "/waypoint/docs", even if there is a dev-portal /docs page
    // ref: https://nextjs.org/docs/api-reference/next.config.js/rewrites
    // (we're using the option to return an object { beforeFiles, afterFiles, fallback }
    // rather than a simple array)
    beforeFiles: [
      {
        source: '/',
        destination: '/waypoint/_secret-io-homepage',
        has: [
          {
            type: 'host',
            value: 'wp.snarglepuss.com',
          },
        ],
      },
      {
        source: '/:path+',
        destination: '/waypoint/:path+',
        has: [
          {
            type: 'host',
            value: 'wp.snarglepuss.com',
          },
        ],
      },
    ],
  }
}

module.exports = rewritesConfig
