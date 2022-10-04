import {
	splitRedirectsByType,
	groupSimpleRedirects,
	addHostCondition,
} from '../redirects'

function withHashiEnv(value, fn) {
	const originalValue = process.env.HASHI_ENV

	process.env.HASHI_ENV = value

	fn()

	process.env.HASHI_ENV = originalValue
}

describe('splitRedirectsByType', () => {
	test('splits simple and glob redirects', () => {
		const { simpleRedirects, globRedirects } = splitRedirectsByType([
			{
				source: '/:path',
				destination: '/',
			},
			{
				source: '/has-cookie/:path',
				destination: '/cookie',
				has: [
					{
						type: 'cookie',
						key: 'cookie',
					},
				],
			},
			{
				source: '/has-cookie',
				destination: '/cookie',
				has: [
					{
						type: 'cookie',
						key: 'cookie',
					},
				],
			},
			{
				source: '/path',
				destination: '',
			},
			{
				source: '/has-host',
				destination: '/host',
				has: [
					{
						type: 'host',
						value: 'www.host.com',
					},
				],
			},
		])
		expect(simpleRedirects).toStrictEqual([
			{
				source: '/path',
				destination: '',
			},
			{
				source: '/has-host',
				destination: '/host',
				has: [
					{
						type: 'host',
						value: 'www.host.com',
					},
				],
			},
		])
		expect(globRedirects).toStrictEqual([
			{
				source: '/:path',
				destination: '/',
			},
			{
				source: '/has-cookie/:path',
				destination: '/cookie',
				has: [
					{
						type: 'cookie',
						key: 'cookie',
					},
				],
			},
			{
				source: '/has-cookie',
				destination: '/cookie',
				has: [
					{
						type: 'cookie',
						key: 'cookie',
					},
				],
			},
		])
	})
})

describe('groupSimpleRedirects', () => {
	test('groups simple redirects by product', () => {
		const groupedSimpleRedirects = groupSimpleRedirects([
			{
				source: '/source',
				destination: '/destination',
				permanent: false,
				has: [
					{
						type: 'host',
						value: '(www\\.boundaryproject\\.io|test-bd\\.hashi-mktg\\.com)',
					},
				],
			},
			{
				source: '/another-source',
				destination: '/another-destination',
				permanent: true,
				has: [
					{
						type: 'host',
						value: '(www\\.boundaryproject\\.io|test-bd\\.hashi-mktg\\.com)',
					},
				],
			},
			{
				source: '/source',
				destination: '/destination',
				permanent: false,
				has: [
					{
						type: 'host',
						value: '(www\\.consul\\.io|test-cs\\.hashi-mktg\\.com)',
					},
				],
			},
			{
				source: '/another-source',
				destination: '/another-destination',
				permanent: true,
				has: [
					{
						type: 'host',
						value: '(www\\.consul\\.io|test-cs\\.hashi-mktg\\.com)',
					},
				],
			},
		])

		expect(groupedSimpleRedirects).toStrictEqual({
			boundary: {
				'/source': {
					destination: '/destination',
					permanent: false,
				},
				'/another-source': {
					destination: '/another-destination',
					permanent: true,
				},
			},
			consul: {
				'/source': {
					destination: '/destination',
					permanent: false,
				},
				'/another-source': {
					destination: '/another-destination',
					permanent: true,
				},
			},
		})
	})

	test('handles simple redirects without associated product', () => {
		const groupedSimpleRedirects = groupSimpleRedirects([
			{
				source: '/source',
				destination: '/destination',
				permanent: false,
			},
		])

		expect(groupedSimpleRedirects).toEqual({
			'*': {
				'/source': {
					destination: '/destination',
					permanent: false,
				},
			},
		})
	})
})

describe('addHostCondition', () => {
	test('adds developer host condition for GA products in production', () => {
		const redirect = {
			source: '/vault/docs/foo',
			destination: '/vault/docs/bar',
			permanent: true,
		}

		let result

		withHashiEnv('production', () => {
			result = addHostCondition([redirect], 'vault', ['waypoint', 'consul'])
		})

		expect(result).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "destination": "/vault/docs/bar",
		    "has": Array [
		      Object {
		        "type": "host",
		        "value": "developer.hashicorp.com",
		      },
		    ],
		    "permanent": true,
		    "source": "/vault/docs/foo",
		  },
		]
	`)
	})

	test('does not add developer host condition for GA products in non-production', () => {
		const redirect = {
			source: '/vault/docs/foo',
			destination: '/vault/docs/bar',
			permanent: true,
		}

		let result

		withHashiEnv('preview', () => {
			result = addHostCondition([redirect], 'vault', ['waypoint', 'consul'])
		})

		expect(result).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "destination": "/vault/docs/bar",
		    "permanent": true,
		    "source": "/vault/docs/foo",
		  },
		]
	`)
	})

	test('adds io host condition for non-GA products in production', () => {
		const redirect = {
			source: '/vault/docs/foo',
			destination: '/vault/docs/bar',
			permanent: true,
		}

		let result

		withHashiEnv('production', () => {
			result = addHostCondition([redirect], 'vault', [
				'waypoint',
				'consul',
				'vault',
			])
		})

		expect(result).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "destination": "/vault/docs/bar",
		    "has": Array [
		      Object {
		        "type": "host",
		        "value": "(www\\\\.vaultproject\\\\.io|test-vt\\\\.hashi-mktg\\\\.com)",
		      },
		    ],
		    "permanent": true,
		    "source": "/vault/docs/foo",
		  },
		]
	`)
	})
})

export {}
