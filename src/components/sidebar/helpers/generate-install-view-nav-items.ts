/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { MenuItem } from '../types'
import { ProductData } from 'types/products'

/**
 * Given a `ProductData` object, generates the nav data for the `Sidebar` that
 * appears on the associated Product's `ProductDownloads` page
 * (/vault/downloads, /waypoint/downloads, etc.).
 *
 * Depends on the data located in the associated `src/data/${product.slug}.json`
 * to be loaded into the `product` object passed.
 *
 * Can optionally be passed menuItems, which determine sidebar content.
 * If menuItems are not provided, falls back to a default generated set
 * identical to the items shown on product landing views.
 */
export const generateInstallViewNavItems = (
	product: ProductData,
	menuItems?: MenuItem[],
	isEnterpriseMode: boolean = false
) => {
	const backToLinkProps = {
		text: `${product.name} Home`,
		href: `/${product.slug}`,
	}
	const levelButtonProps = {
		levelUpButtonText: `${product.name} Home`,
		levelDownButtonText: 'Previous',
	}

	const menuItemsWithFallback = menuItems || []
	const showFilterInput = false
	const title = isEnterpriseMode
		? `Install ${product.name} Enterprise`
		: `Install ${product.name}`
	const titleItem = {
		title,
		fullPath: `/${product.slug}/install`,
		theme: product.slug,
	}

	return {
		backToLinkProps,
		levelButtonProps,
		menuItems: [titleItem, ...menuItemsWithFallback],
		showFilterInput,
		title,
		/* We always visually hide the title, as we've added in a
			"highlight" item that would make showing the title redundant. */
		visuallyHideTitle: true,
	}
}
