import { NavigationHeaderIcon } from 'components/navigation-header/types'
import {
	getDocsNavHasItems,
	getDocsNavItems,
} from 'lib/docs/get-docs-nav-items'
import { NavItem } from './types'
import { ProductData } from 'types/products'
import { PrimaryNavLinkProps } from '../../primary-nav-link'
import { PrimaryNavSubmenuProps } from '../../primary-nav-submenu'

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
	 * Check if docs contains more than one item and
	 * To determine whether to render dropdown or link in nav
	 */
	let docsNavObj:
		| Pick<PrimaryNavSubmenuProps['navItem'], 'iconColorTheme' | 'items'>
		| Pick<PrimaryNavLinkProps['navItem'], 'url'>
	const docsNavHasItems = getDocsNavHasItems(currentProduct)

	if (docsNavHasItems) {
		docsNavObj = {
			iconColorTheme: currentProduct.slug,
			items: getDocsNavItems(currentProduct).map((navItem) => {
				return {
					icon: navItem.icon as NavigationHeaderIcon,
					label: navItem.label,
					path: navItem.fullPath,
				}
			}),
		}
	} else {
		docsNavObj = {
			url: `/${currentProduct.slug}/docs`,
		}
	}

	/**
	 * Define a common set of base nav items
	 */
	const items: NavItem[] = [
		{ label: 'Home', url: `/${currentProduct.slug}` },
		{
			label: 'Documentation',
			...docsNavObj,
		},
		{
			label: 'Tutorials',
			url: `/${currentProduct.slug}/tutorials`,
		},
	]
	if (currentProduct.slug !== 'hcp') {
		items.push({
			label: 'Install',
			url: `/${currentProduct.slug}/downloads`,
		})
	}
	/**
	 * For Terraform, add a "Registry" item
	 */
	if (currentProduct.slug == 'terraform') {
		items.push({
			label: 'Registry',
			url: 'https://registry.terraform.io/',
			openInNewTab: true,
		})
	}
	/**
	 * Return the items
	 */
	return items
}
