/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { NavigationHeaderItemGroup } from 'components/navigation-header/types'
import { getAllProductsNavItems } from 'components/navigation-header/helpers'

/**
 * Build menu items for the mobile menu
 */
export function getProductsDropdownItems(): NavigationHeaderItemGroup[] {
	/**
	 * Build a home menu item, in its own group
	 */
	const homeItemGroup: NavigationHeaderItemGroup = {
		items: [
			{
				icon: 'home',
				label: 'HashiCorp Developer',
				path: '/',
			},
		],
	}
	/**
	 * Build a group of links for each product
	 */
	const productItemsGroup: NavigationHeaderItemGroup = {
		items: getAllProductsNavItems(),
	}
	/**
	 * Return the home item group, and the products item group.
	 */
	return [homeItemGroup, productItemsGroup]
}
