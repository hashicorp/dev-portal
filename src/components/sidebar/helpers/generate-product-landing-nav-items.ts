import addBrandedOverviewSidebarItem from 'lib/docs/add-branded-overview-sidebar-item'
import { getDocsNavItems } from 'lib/docs/get-docs-nav-items'
import { getIsEnabledProductIntegrations } from 'lib/integrations/get-product-slugs-with-integrations'
import { ProductData, RootDocsPath } from 'types/products'
import { EnrichedNavItem, MenuItem, SidebarProps } from '../types'

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
): EnrichedNavItem[] => {
	const routes = getDocsNavItems(product).map(({ label, fullPath }) => ({
		title: label,
		fullPath,
	}))

	let docsItems
	if (product.slug === 'terraform') {
		docsItems = [
			{
				title: 'Documentation',
				isOpen: true,
				routes,
			},
		]
	} else {
		docsItems = routes
	}

	const menuItems = [
		...docsItems,
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
