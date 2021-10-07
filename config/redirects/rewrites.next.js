// wp.snarglepuss.com needs to proxy to ?

const waypointPathRewrites = {
  source: '/:path*',
  destination: '/waypoint/:path*',
  permanent: false,
}

module.exports = (async () => {
  return [...waypointPathRewrites]
})()
