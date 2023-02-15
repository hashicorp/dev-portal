/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProductName, ProductSlug, RootDocsPath } from 'types/products'
import { getParentRootDocsPath } from '../get-parent-root-docs-path'

describe('getParentRootDocsPath', () => {
	it('returns null for a non-nested rootDocsPath', () => {
		// Construct arguments for this test case
		const targetPath = 'api-docs'
		const rootDocsPaths: RootDocsPath[] = [
			{
				iconName: 'docs',
				name: 'Documentation',
				path: 'docs',
			},
			{
				iconName: 'docs',
				name: 'API',
				path: 'api-docs',
			},
		]
		// Assert the expected result
		const expected = null
		expect(getParentRootDocsPath(targetPath, rootDocsPaths)).toEqual(expected)
	})

	it('returns the parent for a nested rootDocsPath', () => {
		// Construct arguments for this test case
		const targetPath = 'plugin/framework'
		const rootDocsPaths: RootDocsPath[] = [
			{
				iconName: 'docs',
				name: 'Documentation',
				path: 'docs',
			},
			{
				iconName: 'docs',
				name: 'Plugin',
				path: 'plugin',
			},
			{
				iconName: 'docs',
				name: 'Plugin Framework',
				path: 'plugin/framework',
			},
		]
		// Assert the expected result
		const expected = {
			iconName: 'docs',
			name: 'Plugin',
			path: 'plugin',
		}
		expect(getParentRootDocsPath(targetPath, rootDocsPaths)).toEqual(expected)
	})

	it('returns null for a nested rootDocsPath without a parent', () => {
		// Construct arguments for this test case
		const targetPath = 'plugin/framework'
		const rootDocsPaths: RootDocsPath[] = [
			{
				iconName: 'docs',
				name: 'Documentation',
				path: 'docs',
			},
			{
				iconName: 'docs',
				name: 'API',
				path: 'api-docs',
			},
			{
				iconName: 'docs',
				name: 'Plugin Framework',
				path: 'plugin/framework',
			},
		]
		// Assert the expected result
		const expected = null
		expect(getParentRootDocsPath(targetPath, rootDocsPaths)).toEqual(expected)
	})
})
