/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import {
	splitRedirectsByType,
	groupSimpleRedirects,
	addHostCondition,
	filterInvalidRedirects,
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
			{
				source: '/another-source',
				destination: '/another-destination',
				permanent: true,
				has: [
					{
						type: 'host',
						value: 'www.waypointproject.io',
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
			waypoint: {
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

	test('does not drop redirects when host condition is developer.hashicorp.com', () => {
		const groupedSimpleRedirects = groupSimpleRedirects([
			{
				source: '/source',
				destination: '/destination',
				permanent: false,
				has: [
					{
						type: 'host',
						value: 'developer.hashicorp.com',
					},
				],
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

describe('filterInvalidRedirects', () => {
	it('filters out redirects that are not prefixed with the product slug', () => {
		//  Spy on and suppress console.warn for this test, we expect a warning
		const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation()
		// Input
		const redirects = [
			{
				source: '/packer/docs/foo',
				destination: '/packer/docs/bar',
				permanent: true,
			},
			{
				source: '/packer/plugins/foo',
				destination: '/prefix/not/required',
				permanent: true,
			},
			{
				source: '/docs/not/prefixed/properly',
				destination: '/packer/destination',
				permanent: true,
			},
		]
		// Expected
		const expected = [
			{
				source: '/packer/docs/foo',
				destination: '/packer/docs/bar',
				permanent: true,
			},
			{
				source: '/packer/plugins/foo',
				destination: '/prefix/not/required',
				permanent: true,
			},
		]
		// Assert expectations
		const result = filterInvalidRedirects(redirects, 'packer')
		expect(result).toStrictEqual(expected)
		// Expect console.warn to have been called
		expect(console.warn).toHaveBeenCalledTimes(1)
		// Restore console.warn for further tests
		consoleWarnMock.mockRestore()
	})

	it('does not filter out /terraform redirects for "terraform-website"', () => {
		// Input, also the expected output
		const redirects = [
			{
				source: '/terraform/docs/foo',
				destination: '/terraform/docs/bar',
				permanent: true,
			},
		]
		// Assert expectations
		const result = filterInvalidRedirects(redirects, 'terraform-website')
		expect(result).toStrictEqual(redirects)
	})

	it('does not filter out /hcp redirects for "cloud.hashicorp.com"', () => {
		// Input, also the expected output
		const redirects = [
			{
				source: '/hcp/docs/foo',
				destination: '/hcp/docs/bar',
				permanent: true,
			},
		]
		// Assert expectations
		const result = filterInvalidRedirects(redirects, 'cloud.hashicorp.com')
		expect(result).toStrictEqual(redirects)
	})
})

export {}
