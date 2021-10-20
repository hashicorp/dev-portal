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
        proxiedRoute: '/commands',
        projectPage: '/waypoint/commands',
      },
      {
        proxiedRoute: '/community',
        projectPage: '/waypoint/community',
      },
      {
        proxiedRoute: '/docs',
        projectPage: '/waypoint/docs',
      },
      {
        proxiedRoute: '/downloads',
        projectPage: '/waypoint/downloads',
      },
      {
        proxiedRoute: '/plugins',
        projectPage: '/waypoint/plugins',
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
