async function rewritesConfig() {
  return {
    beforeFiles: [
      {
        source: '/:path*',
        destination: '/waypoint/:path*',
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
