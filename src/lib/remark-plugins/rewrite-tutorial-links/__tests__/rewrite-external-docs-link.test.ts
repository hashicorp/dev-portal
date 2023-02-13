/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProductSlug } from 'types/products'
import {
	expandUrlTestCasesWithParams,
	TestCase,
} from 'lib/testing/expand-url-test-cases-with-params'
import { productSlugsToHostNames } from 'lib/products'
import { rewriteExternalDocsLink } from '../utils'

const testEachCase = (cases: TestCase[]) => {
	const allCases = expandUrlTestCasesWithParams(cases)
	test.each(allCases)(
		'$input -> $expected',
		({ input, expected }: TestCase) => {
			const testUrlObject = new URL(input, __config.dev_dot.canonical_base_url)
			expect(rewriteExternalDocsLink(testUrlObject)).toBe(expected)
		}
	)
}

describe('rewriteExternalDocsLink', () => {
	describe('when the URL is not to an external docs site', () => {
		testEachCase([
			{ input: '/', expected: undefined },
			{ input: '/vault/api', expected: undefined },
			{ input: '/waypoint/docs', expected: undefined },
			{ input: '/vault/tutorials', expected: undefined },
			{ input: '/waypoint/tutorials', expected: undefined },
			{
				input: 'https://developer.hashicorp.com/vault/api',
				expected: undefined,
			},
			{
				input: 'https://developer.hashicorp.com/waypoint/docs',
				expected: undefined,
			},
			{ input: 'https://learn.hashicorp.com/vault', expected: undefined },
			{ input: 'https://learn.hashicorp.com/waypoint', expected: undefined },
		])
	})

	describe('when the `basePath` is not rewriteable for the determined product', () => {
		testEachCase([
			{ input: 'https://www.vaultproject.io/use-cases', expected: undefined },
			{ input: 'https://www.vaultproject.io/community', expected: undefined },
			{
				input: 'https://www.vaultproject.io/some-random-base-path',
				expected: undefined,
			},
		])
	})

	describe('docs site home pages are *not* rewritten', () => {
		testEachCase(
			Object.keys(productSlugsToHostNames).map((productSlug: ProductSlug) => {
				const input = `https://${productSlugsToHostNames[productSlug]}/`
				const expected = input
				return { input, expected }
			})
		)
	})

	describe('when the base path is not "api"', () => {
		testEachCase([
			{ input: 'https://vaultproject.io/docs', expected: '/vault/docs' },
			{ input: 'https://waypointproject.io/docs', expected: '/waypoint/docs' },
			{
				input: 'https://vaultproject.io/docs/some/path',
				expected: '/vault/docs/some/path',
			},
			{
				input: 'https://waypointproject.io/docs/some/path',
				expected: '/waypoint/docs/some/path',
			},
		])
	})

	describe('when the base path is "api"', () => {
		testEachCase([
			{ input: 'https://vaultproject.io/api', expected: '/vault/api-docs' },
			{
				input: 'https://vaultproject.io/api/some/path',
				expected: '/vault/api-docs/some/path',
			},
		])
	})

	describe('when the page is "index.html"', () => {
		testEachCase([
			{
				input: 'https://waypointproject.io/docs/index.html',
				expected: '/waypoint/docs',
			},
			{
				input: 'https://waypointproject.io/docs/some/path/index.html',
				expected: '/waypoint/docs/some/path',
			},
			{
				input: 'https://vaultproject.io/api/index.html',
				expected: '/vault/api-docs',
			},
			{
				input: 'https://vaultproject.io/api/some/path/index.html',
				expected: '/vault/api-docs/some/path',
			},
		])
	})

	describe('when the page ends with ".html"', () => {
		testEachCase([
			{
				input: 'https://www.terraform.io/downloads.html',
				expected: '/terraform/downloads',
			},
			{
				input: 'https://waypointproject.io/docs/page.html',
				expected: '/waypoint/docs/page',
			},
			{
				input: 'https://waypointproject.io/docs/some/path.html',
				expected: '/waypoint/docs/some/path',
			},
			{
				input: 'https://vaultproject.io/api/page.html',
				expected: '/vault/api-docs/page',
			},
			{
				input: 'https://vaultproject.io/api/some/path.html',
				expected: '/vault/api-docs/some/path',
			},
		])
	})
})
