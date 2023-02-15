/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { fixupPackerPluginUrls } from './fixup-plugin-urls'

type TestCase = {
	url: string
	expected: string
}

describe('fixupPackerPluginUrls', () => {
	it('does not modify non-plugin links', () => {
		const testCases: TestCase[] = [
			{
				url: '/docs/test',
				expected: '/docs/test',
			},
			{
				url: '/docs/test/builders',
				expected: '/docs/test/builders',
			},
			{
				url: '/docs/test/hashicups',
				expected: '/docs/test/hashicups',
			},
		]
		testCases.forEach(({ url, expected }: TestCase) => {
			expect(fixupPackerPluginUrls(url)).toBe(expected)
		})
	})

	it('fixes up base links for known plugin slugs', () => {
		const testCases: TestCase[] = [
			{
				url: '/docs/builders/alicloud',
				expected: '/plugins/builders/alicloud',
			},
			{
				url: '/docs/builders/hyperone',
				expected: '/plugins/builders/hyperone',
			},
		]
		testCases.forEach(({ url, expected }: TestCase) => {
			expect(fixupPackerPluginUrls(url)).toBe(expected)
		})
	})

	it('fixes up base links for known plugin types', () => {
		const testCases: TestCase[] = [
			{
				url: '/docs/builders/hashicups',
				expected: '/plugins/builders/hashicups',
			},
			{
				url: '/docs/datasources/hashicups',
				expected: '/plugins/datasources/hashicups',
			},
			{
				url: '/docs/post-processors/hashicups',
				expected: '/plugins/post-processors/hashicups',
			},
			{
				url: '/docs/provisioners/hashicups',
				expected: '/plugins/provisioners/hashicups',
			},
		]
		testCases.forEach(({ url, expected }: TestCase) => {
			expect(fixupPackerPluginUrls(url)).toBe(expected)
		})
	})

	it('does not modify links with unknown plugin slugs', () => {
		const testCases: TestCase[] = [
			{
				url: '/docs/builders/foobar',
				expected: '/docs/builders/foobar',
			},
		]
		testCases.forEach(({ url, expected }: TestCase) => {
			expect(fixupPackerPluginUrls(url)).toBe(expected)
		})
	})
})
