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
 * Render a list of resource nav items for a given product slug.
 */
export function ProductResourceNavItems({ slug }: { slug: ProductSlug }) {
	return (
		<ul className={s.listResetStyles}>
			{generateResourcesNavItems(slug).map((item: MenuItem, index: number) => (
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
	return {
		levelButtonText: 'Main Menu',
		content: (
			<>
				<h3 className={s.heading}>Main Menu</h3>
				<ul className={s.listResetStyles}>
					{generateTopLevelSubNavItems().map(
						(item: MenuItem, index: number) => (
							// eslint-disable-next-line react/no-array-index-key
							<SidebarNavMenuItem item={item} key={index} />
						)
					)}
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
	return {
		levelButtonText: `${productData.name} Home`,
		content: (
			<ul className={s.listResetStyles}>
				{[
					{
						title: productData.name,
						fullPath: `/${productData.slug}`,
						theme: productData.slug,
					},
					...generateProductLandingSidebarMenuItems(productData),
				].map((item: MenuItem, index: number) => (
					// eslint-disable-next-line react/no-array-index-key
					<SidebarNavMenuItem item={item} key={index} />
				))}
				<SidebarHorizontalRule />
				<ProductResourceNavItems slug={productData.slug} />
			</ul>
		),
	}
}
