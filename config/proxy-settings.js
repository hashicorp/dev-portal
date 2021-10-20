module.exports = {
  waypoint: {
    // actually https://waypointproject.io, but using wp.snarglepuss.com as a test
    domain: 'https://wp.snarglepuss.com',
    host: 'wp.snarglepuss.com',
    routesToProxy: [
      {
        proxiedRoute: '/',
        projectPage: '/waypoint/_secret-io-homepage',
      },
      {
        proxiedRoute: '/commands/:path*',
        projectPage: '/waypoint/commands/:path*',
      },
      {
        proxiedRoute: '/community',
        projectPage: '/waypoint/community',
      },
      {
        proxiedRoute: '/docs/:path*',
        projectPage: '/waypoint/docs/:path*',
      },
      {
        proxiedRoute: '/downloads',
        projectPage: '/waypoint/downloads',
      },
      {
        proxiedRoute: '/plugins/:path*',
        projectPage: '/waypoint/plugins/:path*',
      },
      {
        proxiedRoute: '/security',
        projectPage: '/waypoint/security',
      },
      {
        proxiedRoute: '/terms',
        projectPage: '/waypoint/terms',
      },
    ],
  },
}
