// wp.snarglepuss.com needs to proxy to ?

const waypointPathRewrites = {
  source: '/:path*',
  destination: '/waypoint/:path*',
  has: [
    {
      type: 'host',
      value: 'wp.snarglepuss.com',
    },
  ],
  permanent: false,
}

module.exports = (async () => {
  return [...waypointPathRewrites]
})()
