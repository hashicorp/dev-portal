/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import {
	splitRedirectsByType,
	groupSimpleRedirects,
	filterInvalidRedirects,
	getRedirectsFromContentRepo,
} from '../redirects'

afterEach(() => {
	vi.restoreAllMocks()
})

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
		const consoleWarnMock = vi
			.spyOn(console, 'warn')
			.mockImplementation(() => {})
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

describe('getRedirectsFromContentRepo', () => {
	it('returns redirects from UDR for a migrated repo', async () => {
		const mockData = [
			{
				source: '/terraform/cloud-docs/policy-enforcement/opa/vcs',
				destination:
					'/terraform/cloud-docs/policy-enforcement/manage-policy-sets/opa-vcs',
				permanent: true,
			},
			{
				source: '/terraform/cloud-docs/policy-enforcement/policy-results',
				destination: '/terraform/cloud-docs/policy-enforcement/view-results',
				permanent: true,
			},
		]
		global.fetch = vi.fn().mockResolvedValue({
			json: () => new Promise((resolve) => resolve(mockData)),
			ok: true,
		})

		const redirects = await getRedirectsFromContentRepo(
			'terraform-docs-common',
			'test',
			{
				'flags.unified_docs_migrated_repos': ['terraform-docs-common'],
			}
		)

		expect(redirects).toEqual(mockData)
	})

	it('returns empty array if there are not any redirects from UDR for a migrated repo', async () => {
		global.fetch = vi.fn().mockResolvedValue({ ok: false })
		const mockConsole = vi.spyOn(console, 'error').mockImplementation(() => {})

		const redirects = await getRedirectsFromContentRepo(
			'terraform-enterprise',
			'test',
			{
				'flags.unified_docs_migrated_repos': ['terraform-enterprise'],
			}
		)

		expect(redirects).toEqual([])
		expect(mockConsole).toHaveBeenCalledOnce()
	})
})

export {}
