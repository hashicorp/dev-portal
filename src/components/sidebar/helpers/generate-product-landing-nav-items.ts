import { getDocsNavItems } from 'lib/docs/get-docs-nav-items'
import { ProductData, RootDocsPath } from 'types/products'

const IS_DEV = process.env.NODE_ENV !== 'production'

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
) => {
	const routes = getDocsNavItems(product).map(({ label, fullPath }) => ({
		title: label,
		fullPath,
	}))
	const defaultDocsMenuItem = {
		title: 'Documentation',
		fullPath: `/${product.slug}/docs`,
	}
	const documentationSubmenu =
		routes.length > 1
			? {
					title: 'Documentation',
					isOpen: true,
					routes,
			  }
			: defaultDocsMenuItem
	const menuItems = [
		documentationSubmenu,
		{
			title: 'Tutorials',
			fullPath: `/${product.slug}/tutorials`,
		},
	]
	if (product.slug !== 'hcp') {
		menuItems.push({
			title: 'Install',
			fullPath: `/${product.slug}/downloads`,
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
export const generateProductLandingSidebarNavData = (product: ProductData) => {
	const levelButtonProps = {
		levelUpButtonText: 'Main Menu',
		levelDownButtonText: 'Previous',
	}
	const menuItems = generateProductLandingSidebarMenuItems(product)
	const showFilterInput = false
	const title = product.name

	return {
		levelButtonProps,
		menuItems,
		showFilterInput,
		title,
	}
}
