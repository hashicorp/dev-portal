// Components
import {
	SidebarHorizontalRule,
	SidebarNavMenuItem,
} from 'components/sidebar/components'
// Utils
import { generateTopLevelSubNavItems } from 'lib/generate-top-level-sub-nav-items'
import { generateProductLandingSidebarMenuItems } from 'components/sidebar/helpers/generate-product-landing-nav-items'
import { generateResourcesNavItems } from 'components/sidebar/helpers'
// Types
import type { MenuItem } from 'components/sidebar'
import type { ProductData, ProductSlug } from 'types/products'
import type { MobileMenuLevelData } from '../types'
// Styles
import s from './level-components.module.css'

/**
 * TODO: these "level components" are a good candidate for refactoring.
 * We should refactor `mobile-menu-levels` `level-components` to decouple
 * business logic & presentation.
 *
 * This approach here to build `MobileMenuLevelData` doesn't fit as nicely
 * into our "view-model" approach to component composition.
 *
 * This was created as an initial mechanism to decouple the mobile menu from
 * the sidebar nav data context, and the intertwined `generate` functions were
 * retained as a way to ensure consistency with existing mobile menus.
 *
 * We'll likely want to refactor this further to split out the intertwined:
 * - logic for generating the menu item data (eg `generateResourcesNavItems`)
 * - presentation of that data using `<SidebarNavMenuItem />`
 *
 * To do this consistently across the app, it feels like this might be a
 * reasonably large scope of refactor. With this in mind, this work
 * was left out of the scope of the API docs template revision.
 *
 * Task:
 * https://app.asana.com/0/1202097197789424/1205093670087688/f
 */

/**
 * Render a list of resource nav items for a given product slug.
 */
export function ProductResourceNavItems({ slug }: { slug: ProductSlug }) {
	/**
	 * TODO: this is some business logic that's intertwined with presentation.
	 * As mentioned in the comment at the top of this file, this is an initial
	 * cut at decoupling the mobile menu from the sidebar nav data context,
	 * and is likely something we want to further refactor.
	 */
	const menuItems = generateResourcesNavItems(slug)

	return (
		<ul className={s.listResetStyles}>
			{menuItems.map((item: MenuItem, index: number) => (
				// eslint-disable-next-line react/no-array-index-key
				<SidebarNavMenuItem item={item} key={index} />
			))}
		</ul>
	)
}

/**
 * Return mobile menu level data for the shared `main` menu pane.
 */
export function mobileMenuLevelMain(): MobileMenuLevelData {
	/**
	 * TODO: this is some business logic that's intertwined with presentation.
	 * As mentioned in the comment at the top of this file, this is an initial
	 * cut at decoupling the mobile menu from the sidebar nav data context,
	 * and is likely something we want to further refactor.
	 */
	const menuItems = generateTopLevelSubNavItems()

	return {
		levelButtonText: 'Main Menu',
		content: (
			<>
				<h3 className={s.heading}>Main Menu</h3>
				<ul className={s.listResetStyles}>
					{menuItems.map((item: MenuItem, index: number) => (
						// eslint-disable-next-line react/no-array-index-key
						<SidebarNavMenuItem item={item} key={index} />
					))}
				</ul>
			</>
		),
	}
}

/**
 * Return mobile menu level data for a common `product` menu pane.
 */
export function mobileMenuLevelProduct(
	productData: ProductData
): MobileMenuLevelData {
	/**
	 * TODO: this is some business logic that's intertwined with presentation.
	 * As mentioned in the comment at the top of this file, this is an initial
	 * cut at decoupling the mobile menu from the sidebar nav data context,
	 * and is likely something we want to further refactor.
	 */
	const menuItems = [
		{
			title: productData.name,
			fullPath: `/${productData.slug}`,
			theme: productData.slug,
		},
		...generateProductLandingSidebarMenuItems(productData),
	]

	return {
		levelButtonText: `${productData.name} Home`,
		content: (
			<ul className={s.listResetStyles}>
				{menuItems.map((item: MenuItem, index: number) => (
					// eslint-disable-next-line react/no-array-index-key
					<SidebarNavMenuItem item={item} key={index} />
				))}
				<SidebarHorizontalRule />
				<ProductResourceNavItems slug={productData.slug} />
			</ul>
		),
	}
}
