const waypointPathRewrites = [
  {
    source: '/',
    destination: '/waypoint/_secret-io-homepage',
    // has: [
    //   {
    //     type: 'host',
    //     value: 'wp.snarglepuss.com',
    //   },
    // ],
  },
  // {
  //   source: '/:path*',
  //   destination: '/waypoint/:path*',
  //   has: [
  //     {
  //       type: 'host',
  //       value: 'wp.snarglepuss.com',
  //     },
  //   ],
  // },
]

async function rewritesConfig() {
  return [...waypointPathRewrites]
}

module.exports = rewritesConfig
