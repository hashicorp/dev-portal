// wp.snarglepuss.com needs to proxy to ?

const waypointPathRewrites = [{
  source: '/:path*',
  destination: '/waypoint/:path*',
  has: [
    {
      type: 'host',
      value: 'wp.snarglepuss.com',
    },
  ],
  permanent: false,
}]

async function rewritesConfig() {
  return [...waypointPathRewrites]
}

module.exports = rewritesConfig

     // return [
      //   { source: '/', destination: '/waypoint' }, // does not match localhost:3000
      //   {
      //     source: '/:path*{/}?', // does not match localhost:3000, but matches other routes
      //     destination: '/waypoint/:path*'
      //   },
      // ]