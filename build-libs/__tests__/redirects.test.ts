/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import {
	splitRedirectsByType,
	groupSimpleRedirects,
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
		const { simpleRedirects, complexRedirects } = splitRedirectsByType([
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
		])
		expect(complexRedirects).toStrictEqual([
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
	})
})

describe('groupSimpleRedirects', () => {
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
