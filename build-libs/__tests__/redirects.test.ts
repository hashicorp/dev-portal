import { splitRedirectsByType, groupSimpleRedirects } from '../redirects'

describe('splitRedirectsByType', () => {
	test('splits simple and glob redirects', () => {
		const { simpleRedirects, globRedirects } = splitRedirectsByType([
			{
				source: '/:path',
				destination: '/',
				permanent: true,
			},
			{
				source: '/has-cookie/:path',
				destination: '/cookie',
				permanent: true,
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
				permanent: true,
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
				permanent: true,
			},
			{
				source: '/has-host',
				destination: '/host',
				permanent: true,
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
				permanent: true,
			},
			{
				source: '/has-host',
				destination: '/host',
				permanent: true,
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
				permanent: true,
			},
			{
				source: '/has-cookie/:path',
				destination: '/cookie',
				permanent: true,

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
				permanent: true,

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

export {}
