import buildBetaProductOptInRedirect from '../build-beta-opt-in-redirect'

describe('buildBetaOptInRedirect', () => {
  test('builds a redirect definition for beta opt-in', () => {
    expect(
      buildBetaProductOptInRedirect('waypoint', ['docs', 'commands', 'plugins'])
    ).toMatchInlineSnapshot(`
      Object {
        "destination": "https://developer.hashi-mktg.com/waypoint/:base/:path*",
        "has": Array [
          Object {
            "key": "waypoint-io-beta-opt-in",
            "type": "cookie",
            "value": "true",
          },
          Object {
            "type": "host",
            "value": "(www\\\\.waypointproject\\\\.io|test-wp\\\\.hashi-mktg\\\\.com)",
          },
        ],
        "permanent": false,
        "source": "/:base(docs|commands|plugins)/:path*",
      }
    `)
  })
})
