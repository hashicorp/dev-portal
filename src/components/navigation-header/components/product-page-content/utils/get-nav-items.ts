import { NavigationHeaderIcon } from 'components/navigation-header/types'
import { NavItem } from './types'
import { ProductData, RootDocsPath } from 'types/products'

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
			items: currentProduct.rootDocsPaths.map((rootDocsPath: RootDocsPath) => {
				return {
					icon: rootDocsPath.iconName as NavigationHeaderIcon,
					label: rootDocsPath.name,
					path: `/${currentProduct.slug}/${rootDocsPath.path}`,
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
		})
	}
	/**
	 * Return the items
	 */
	return items
}
