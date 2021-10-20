// const waypointPathRewrites = [
//   {
//     source: '/:path*',
//     destination: '/waypoint/:path*',
//     has: [
//       {
//         type: 'host',
//         value: 'wp.snarglepuss.com',
//       },
//     ],
//   },
// ]

async function rewritesConfig() {
  return {
    beforeFiles: [
      {
        source: '/',
        destination: '/waypoint/_secret-io-homepage',
      },
    ],
  }
}

module.exports = rewritesConfig
