import buildBetaProductOptInRedirect from '../build-beta-opt-in-redirect'

describe('buildBetaOptInRedirect', () => {
	test('builds a redirect definition for beta opt-in', () => {
		expect(buildBetaProductOptInRedirect()).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "destination": "https://developer.hashicorp.com/packer/:base/:path*",
		    "has": Array [
		      Object {
		        "key": "packer-io-beta-opt-in",
		        "type": "cookie",
		        "value": "true",
		      },
		      Object {
		        "type": "host",
		        "value": "(www\\\\.packer\\\\.io|test-pk\\\\.hashi-mktg\\\\.com)",
		      },
		    ],
		    "permanent": false,
		    "source": "/:base(docs|guides|intro|plugins|downloads)/:path*",
		  },
		]
	`)
	})
})
