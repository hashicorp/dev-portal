/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { generateResourcesNavItems } from '../generate-resources-nav-items'
import { ProductSlug } from 'types/products'

describe('generateResourcesNavItems', () => {
	it('includes sandbox items in the resources navigation', () => {
		// Sample product data
		const productSlug = 'vault' as ProductSlug

		// Generate the navigation items
		const navItems = generateResourcesNavItems(productSlug)

		// Find the sandbox item
		const sandboxItem = navItems.find(
			(item) => 'title' in item && item.title === 'Sandbox'
		)

		// Verify the sandbox item exists and has the correct properties
		expect(sandboxItem).toBeDefined()
		expect('href' in sandboxItem).toBe(true)
		expect(sandboxItem['href']).toBe('/vault/sandbox')
	})

	it('handles products with no available sandboxes', () => {
		// Sample product data for a product with no sandboxes
		const productSlug = 'non-existent-product' as ProductSlug

		// Generate the navigation items
		const navItems = generateResourcesNavItems(productSlug)

		// Find the sandbox item
		const sandboxItem = navItems.find(
			(item) => 'title' in item && item.title === 'Sandbox'
		)

		// Verify the sandbox item doesn't exist for unsupported products
		expect(sandboxItem).toBeUndefined()
	})

	it('includes sandbox link for supported products', () => {
		// Mock the supported products in SANDBOX_CONFIG
		const productSlug = 'nomad' as ProductSlug

		// Generate the navigation items
		const navItems = generateResourcesNavItems(productSlug)

		// Find the sandbox item
		const sandboxItem = navItems.find(
			(item) => 'title' in item && item.title === 'Sandbox'
		)

		// Verify the sandbox item exists for supported products
		expect(sandboxItem).toBeDefined()
		if (sandboxItem && 'href' in sandboxItem) {
			expect(sandboxItem.href).toBe('/nomad/sandbox')
		}
	})

	it('includes common resource links for all products', () => {
		const productSlug = 'vault' as ProductSlug

		// Generate the navigation items
		const navItems = generateResourcesNavItems(productSlug)

		// Find common resources
		const tutorialLibrary = navItems.find(
			(item) => 'title' in item && item.title === 'Tutorial Library'
		)
		const communityForum = navItems.find(
			(item) => 'title' in item && item.title === 'Community Forum'
		)
		const support = navItems.find(
			(item) => 'title' in item && item.title === 'Support'
		)

		// Verify common resources exist
		expect(tutorialLibrary).toBeDefined()
		expect(communityForum).toBeDefined()
		expect(support).toBeDefined()
	})
})
