async function rewritesConfig() {
  return {
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
