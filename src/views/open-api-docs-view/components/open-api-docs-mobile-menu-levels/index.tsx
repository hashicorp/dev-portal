// Components
import MobileMenuLevels from 'components/mobile-menu-levels'
import { SidebarHorizontalRule } from 'components/sidebar/components'
import {
	ProductResourceNavItems,
	mobileMenuLevelMain,
	mobileMenuLevelProduct,
} from 'components/mobile-menu-levels/level-components'
// Local
import { OpenApiSidebarContents } from '../open-api-sidebar-contents'
// Types
import type { ProductData } from 'types/products'
import type { OpenApiNavItem } from 'views/open-api-docs-view/types'

/**
 * Placeholder for OpenApiDocsView mobile menu levels.
 */
export function OpenApiDocsMobileMenuLevels({
	productData,
	navItems,
}: {
	// Product data, used to generate mobile menu levels.
	productData: ProductData
	navItems: OpenApiNavItem[]
}) {
	return (
		<MobileMenuLevels
			levels={[
				mobileMenuLevelMain(),
				mobileMenuLevelProduct(productData),
				{
					levelButtonText: 'Previous',
					content: (
						<div>
							{/* API docs mobile menu contents */}
							<OpenApiSidebarContents navItems={navItems} />
							{/* Common resources for this product */}
							<SidebarHorizontalRule />
							<ProductResourceNavItems slug={productData.slug} />
						</div>
					),
				},
			]}
		/>
	)
}
