import { NavigationHeaderIcon } from 'components/navigation-header/types'
import { getDocsNavItems } from 'lib/docs/get-docs-nav-items'
import { NavItem } from './types'
import { ProductData } from 'types/products'

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
	 * Define a common set of base nav items
	 */
	const items: NavItem[] = [
		{ label: 'Home', url: `/${currentProduct.slug}` },
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
		{
			label: 'Tutorials',
			url: `/${currentProduct.slug}/tutorials`,
		},
		{
			label: 'Install',
			url: `/${currentProduct.slug}/downloads`,
		},
	]
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
