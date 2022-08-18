import {
	NavigationHeaderIcon,
	NavigationHeaderItem,
} from 'components/navigation-header/types'
import { ProductData, ProductSlug, RootDocsPath } from 'types/products'

/**
 * TODO: move these to an adjacent types.ts file,
 * better yet merge with broader navigation-header/types.ts,
 * though not sure whether that will end up ballooning scope a bit.
 */

interface NavItemLink {
	type: 'link'
	label: string
	url: string
}

interface NavItemSubmenu {
	type: 'submenu'
	label: string
	iconColorTheme: ProductSlug
	items: NavigationHeaderItem[]
}

type NavItem = NavItemLink | NavItemSubmenu

export function getNavItems(currentProduct: ProductData): NavItem[] {
	/**
	 * Define a common set of base nav items
	 */
	const items: NavItem[] = [
		{ type: 'link', label: 'Home', url: `/${currentProduct.slug}` },
		{
			type: 'submenu',
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
			type: 'link',
			label: 'Tutorials',
			url: `/${currentProduct.slug}/tutorials`,
		},
		{
			type: 'link',
			label: 'Install',
			url: `/${currentProduct.slug}/tutorials`,
		},
	]
	/**
	 * For Terraform, add a "Registry" item
	 */
	if (currentProduct.slug == 'terraform') {
		items.push({
			type: 'link',
			label: 'Registry',
			url: 'https://registry.terraform.io/',
		})
	}
	/**
	 * Return the items
	 */
	return items
}
