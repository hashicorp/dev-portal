import nock from 'nock'

import { getStaticPathsFromAnalytics } from 'lib/get-static-paths-from-analytics'

import staticPathsResultFixture from './__fixtures__/static_paths_waypoint_docs.json'

process.env.MKTG_CONTENT_API = 'https://content.hashicorp.com'

describe('getStaticPathsFromAnalytics', () => {
	test('fetches static paths from the analytics endpoint - no valid paths', async () => {
		nock(process.env.MKTG_CONTENT_API)
			.get('/api/static_paths')
			.query({
				product: 'developer',
				param: 'page',
				limit: 10,
				path_prefix: '/waypoint/docs',
			})
			.reply(200, staticPathsResultFixture)

		const result = await getStaticPathsFromAnalytics({
			param: 'page',
			limit: 10,
			pathPrefix: '/waypoint/docs',
		})

		expect(result.length).toEqual(10)
	})

	test('fetches static paths from the analytics endpoint - filters with valid paths', async () => {
		nock(process.env.MKTG_CONTENT_API)
			.get('/api/static_paths')
			.query({
				product: 'developer',
				param: 'page',
				limit: 10,
				path_prefix: '/waypoint/docs',
			})
			.reply(200, staticPathsResultFixture)

		const result = await getStaticPathsFromAnalytics({
			param: 'page',
			limit: 10,
			pathPrefix: '/waypoint/docs',
			validPaths: [{ params: { page: ['getting-started'] } }],
		})

		expect(result.length).toEqual(1)

		expect(result).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "params": Object {
		      "page": Array [
		        "getting-started",
		      ],
		    },
		  },
		]
	`)
	})
})
