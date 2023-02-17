/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProductName, ProductSlug } from 'types/products'
import { getBackToLink } from '../get-back-to-link'

describe('fullPathFromRelativeHref', () => {
	it('generates a generic backToLink for a non-nested currentRootDocsPath', () => {
		// Construct arguments for this test case
		const currentRootDocsPath = {
			name: 'Documentation',
			path: 'docs',
		}
		const productData = {
			name: 'Vault' as ProductName,
			slug: 'vault' as ProductSlug,
			rootDocsPaths: [
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
			],
		}
		// Assert the expected result
		const expected = {
			text: 'Vault Home',
			href: '/vault',
		}
		expect(getBackToLink(currentRootDocsPath, productData)).toEqual(expected)
	})

	it('generates a level-up backToLink for a nested currentRootDocsPath', () => {
		// Construct arguments for this test case
		const currentRootDocsPath = {
			name: 'Plugin Framework',
			path: 'plugin/framework',
		}
		const productData = {
			name: 'Terraform' as ProductName,
			slug: 'terraform' as ProductSlug,
			rootDocsPaths: [
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
			],
		}
		// Assert the expected result
		const expected = {
			text: 'Plugin',
			href: '/terraform/plugin',
		}
		expect(getBackToLink(currentRootDocsPath, productData)).toEqual(expected)
	})

	it('generates a generic backToLink for a nested currentRootDocsPath without a parent rootDocsPath', () => {
		// Construct arguments for this test case
		const currentRootDocsPath = {
			name: 'Plugin Framework',
			path: 'plugin/framework',
		}
		const productData = {
			name: 'Terraform' as ProductName,
			slug: 'terraform' as ProductSlug,
			rootDocsPaths: [
				{
					iconName: 'docs',
					name: 'Documentation',
					path: 'docs',
				},
				{
					iconName: 'docs',
					name: 'Plugin Framework',
					path: 'plugin/framework',
				},
			],
		}
		// Assert the expected result
		const expected = {
			text: 'Terraform Home',
			href: '/terraform',
		}
		expect(getBackToLink(currentRootDocsPath, productData)).toEqual(expected)
	})
})
