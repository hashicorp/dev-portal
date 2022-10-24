import buildBetaProductOptInRedirect from '../build-beta-opt-in-redirect'

describe('buildBetaOptInRedirect', () => {
	test('builds a redirect definition for beta opt-in', () => {
		expect(buildBetaProductOptInRedirect()).toMatchInlineSnapshot(`Array []`)
	})
})
