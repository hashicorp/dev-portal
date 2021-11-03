module.exports = {
  boundary: {
    // actually https://boundaryproject.io, but using test-bd.hashi-mktg.com as a test
    domain: 'https://test-bd.hashi-mktg.com',
    host: 'test-bd.hashi-mktg.com',
    routesToProxy: [
      {
        proxiedRoute: '/',
        projectPage: '/_proxied-dot-io/boundary',
      },
      {
        proxiedRoute: '/docs/:path*',
        projectPage: '/_proxied-dot-io/boundary/docs/:path*',
      },
      {
        proxiedRoute: '/api-docs/:path*',
        projectPage: '/_proxied-dot-io/boundary/api-docs/:path*',
      },
      {
        proxiedRoute: '/community',
        projectPage: '/_proxied-dot-io/boundary/community',
      },
      {
        proxiedRoute: '/downloads',
        projectPage: '/_proxied-dot-io/boundary/downloads',
      },
      {
        proxiedRoute: '/security',
        projectPage: '/_proxied-dot-io/boundary/security',
      },
    ],
  },
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
