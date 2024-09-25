/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import addBrandedOverviewSidebarItem from 'lib/docs/add-branded-overview-sidebar-item'
import { getDocsNavItems } from 'lib/docs/get-docs-nav-items'
import { getIsEnabledProductIntegrations } from 'lib/integrations/get-is-enabled-product-integrations'
import { ProductData } from 'types/products'
import { EnrichedNavItem, SidebarProps } from '../types'

/**
 * Generates the Sidebar menuItems for product landing pages
 * (/waypoint, /vault, etc.).
 *
 * Written in a way that enables slow migration of products as they're released
 * in beta via the `rootDocsPaths` property defined in
 * `src/data/${productSlug}.json` files.
 *
 * @TODO remove the if-else once all products have a `rootDocsPaths` property
 * defined in their `src/data/${productSlug}.json` files.
 */
export const generateProductLandingSidebarMenuItems = (
	product: ProductData
): EnrichedNavItem[] => {
	const routes = getDocsNavItems(product).map(({ label, fullPath }) => ({
		title: label,
		fullPath,
	}))

	let docsItems
	const menuItems = []
	const introNavItem = routes.find((route) => route.fullPath.endsWith('/intro'))

	/**
	 * This order is meaningful and should align with the global nav order see
	 * /src/components/navigation-header/components/product-page-content/utils/get-nav-items.ts
	 *
	 * - Install
	 * - Intro (if exists)
	 * - Tutorials
	 * - Documentation and all other docs paths (e.g. API / CLI)
	 * - Integrations
	 *
	 * We should refactor to drive this via global config https://app.asana.com/0/1204807665183200/1205002760871766/f
	 */

	if (product.slug !== 'hcp' && product.slug !== 'waypoint') {
		menuItems.push({
			title: 'Install',
			fullPath: `/${product.slug}/install`,
		})
	}

	if (product.slug === 'terraform') {
		docsItems = [
			{
				title: 'Documentation',
				isOpen: true,
				routes: introNavItem
					? routes.filter((route) => !route.fullPath.endsWith('/intro'))
					: routes,
			},
		]
	} else {
		docsItems = introNavItem
			? routes.filter((route) => !route.fullPath.endsWith('/intro'))
			: routes
	}

	if (introNavItem) {
		menuItems.push(introNavItem)
	}

	// Add a "Tutorials" link for all products
	if (product.slug !== 'sentinel') {
		menuItems.push({
			title: 'Tutorials',
			fullPath: `/${product.slug}/tutorials`,
		})
	}

	// Add "Documentation" item links for all products
	menuItems.push(...docsItems)

	if (getIsEnabledProductIntegrations(product.slug)) {
		menuItems.push({
			title: 'Integrations',
			fullPath: `/${product.slug}/integrations`,
		})
	}

	return menuItems
}

/**
 * Given a `ProductData` object, generates the nav data for the `Sidebar` that
 * appears on the associated Product's `ProductLandingView` page (/vault,
 * /waypoint, etc.).
 *
 * Depends on the data located in the associated `src/data/${product.slug}.json`
 * to be loaded into the `product` object passed.
 */
export const generateProductLandingSidebarNavData = (
	product: ProductData
): SidebarProps => {
	const levelButtonProps = {
		levelUpButtonText: 'Main Menu',
		levelDownButtonText: 'Previous',
	}
	const menuItems = generateProductLandingSidebarMenuItems(product)
	const showFilterInput = false
	const title = product.name

	return {
		levelButtonProps,
		/**
		 * TODO: fix up MenuItem related types.
		 * Task: https://app.asana.com/0/1202097197789424/1202405210286689/f
		 */
		menuItems: addBrandedOverviewSidebarItem(menuItems, {
			title,
			fullPath: `/${product.slug}`,
			theme: product.slug,
		}) as $TSFixMe,
		showFilterInput,
		title,
		/* We always visually hide the title, as we've added in a
			"highlight" item that would make showing the title redundant. */
		visuallyHideTitle: true,
	}
}
