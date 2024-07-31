/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { NavigationHeaderIcon } from 'components/navigation-header/types'
import { getDocsNavItems } from 'lib/docs/get-docs-nav-items'
import { getIsEnabledProductIntegrations } from 'lib/integrations/get-is-enabled-product-integrations'
import { ProductData } from 'types/products'
import { NavItem } from './types'

const TRY_CLOUD_ITEM_PRODUCT_SLUGS = [
	'boundary',
	'consul',
	'hcp',
	'packer',
	'terraform',
	'vagrant',
	'vault',
	'waypoint',
]

enum TRY_CLOUD_PRODUCT_LINKS {
	default = 'https://portal.cloud.hashicorp.com/sign-up',
	terraform = 'https://app.terraform.io/public/signup/account',
	vagrant = 'https://app.vagrantup.com/boxes/search',
}

/**
 * Given current product data,
 * Return an array of NavItems to render in the top navigation bar.
 *
 * Note that these items are only shown on larger viewports.
 * On smaller viewports, a separate mobile menu is shown, which
 * does not use this exact function to generate nav items,
 * so may not show the same set of items.
 */
export function getNavItems(currentProduct: ProductData): NavItem[] {
	/**
	 * All products except Terraform currently have a small enough number
	 * of distinct documentation "categories" (ie path like /docs, /api, etc)
	 * that there is space to list all "categories" directly in the top nav bar.
	 *
	 * For Terraform, there are too many docs categories for this to work
	 * with the space we have available in the top nav bar.
	 * So, we construct a "Documentation" dropdown for the top nav bar.
	 */
	let docsNavItems: NavItem[]
	if (currentProduct.slug === 'terraform') {
		// Dropdown for Terraform
		docsNavItems = [
			{
				label: 'Documentation',
				iconColorTheme: currentProduct.slug,
				items: getDocsNavItems(currentProduct).map((navItem) => {
					return {
						icon: navItem.icon as NavigationHeaderIcon,
						label: navItem.label,
						path: navItem.fullPath,
					}
				}),
			},
		]
	} else {
		// Flattened docs category links for all other products
		docsNavItems = getDocsNavItems(currentProduct).map((navItem) => {
			return {
				label: navItem.label,
				url: navItem.fullPath,
			}
		})
	}

	/**
	 * Define a common set of base nav items. Note that we want these to
	 * be in a specific and consistent order across all products.
	 *
	 * The following order will be applied:
	 * 1. Install
	 * 2. Intro (a docs content category, used by Nomad & Vagrant)
	 * 3. Tutorials
	 * 4. Documentation content categories (except "/intro")
	 * 	  - Desired order: Docs, API, CLI, Tools, Plugins, Cloud, ...rest
	 *    - Note that for Terraform, we render a dropdown, rather than
	 *      individual items.
	 *    - The ordering of docs categories is defined in src/data/<product>.json
	 *      for each product. (Except /intro, which is manually inserted earlier)
	 * 5. ...any other custom links, such as Terraform Registry
	 * 6. "Try cloud"
	 *
	 * Note: most products only have a few of these links.
	 * Consistent ordering is applied regardless of which links are present.
	 */
	const items: NavItem[] = []

	/**
	 * Install
	 */
	if (
		currentProduct.slug !== 'hcp' &&
		currentProduct.slug !== 'waypoint' &&
		currentProduct.slug !== 'well-architected-framework'
	) {
		items.push({
			label: 'Install',
			url: `/${currentProduct.slug}/install`,
		})
	}

	/**
	 * Intro
	 *
	 * Note: This is an optional docs category, /<product>/intro. It is placed
	 * earlier in the nav, separate from other docs categories.
	 *
	 * Note: As of 2023-01-18, Nomad & Vagrant are the only products with an
	 * "intro" docs category. All other products do not use this category.
	 */
	const introItemPath = `/${currentProduct.slug}/intro`
	const isIntroItem = (n: NavItem) => 'url' in n && n.url === introItemPath
	const introItem = docsNavItems.find(isIntroItem)
	if (introItem) {
		items.push(introItem)
	}

	/**
	 * Tutorials
	 *
	 * Note: we exclude Sentinel, as it does not have tutorials yet.
	 */
	if (
		currentProduct.slug !== 'sentinel' &&
		currentProduct.slug !== 'well-architected-framework'
	) {
		items.push({
			label: 'Tutorials',
			url: `/${currentProduct.slug}/tutorials`,
		})
	}

	/**
	 * Documentation categories
	 * (flattened list for most products, or a dropdown for Terraform)
	 * (note that /<product>/intro is excluded, as it was included earlier)
	 */
	for (const docsNavItem of docsNavItems) {
		// Skip /<product>/intro
		if (isIntroItem(docsNavItem)) {
			continue
		} else {
			items.push(docsNavItem)
		}
	}

	/**
	 * For Terraform, add a "Registry" item
	 */
	if (currentProduct.slug === 'terraform') {
		items.push({
			label: 'Registry',
			url: 'https://registry.terraform.io/',
			opensInNewTab: true,
		})
	} else if (getIsEnabledProductIntegrations(currentProduct.slug)) {
		items.push({
			label: 'Integrations',
			url: `/${currentProduct.slug}/integrations`,
		})
	}

	/**
	 * For cloud products, add a "Try Cloud" item
	 */
	if (TRY_CLOUD_ITEM_PRODUCT_SLUGS.includes(currentProduct.slug)) {
		items.push({
			label: 'Try Cloud',
			url:
				TRY_CLOUD_PRODUCT_LINKS[currentProduct.slug] ??
				TRY_CLOUD_PRODUCT_LINKS['default'],
			opensInNewTab: true,
		})
	}

	/**
	 * Return the items
	 */
	return items
}
