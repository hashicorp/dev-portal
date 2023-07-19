// Components
import MobileMenuLevels from 'components/mobile-menu-levels'
import { SidebarHorizontalRule } from 'components/sidebar/components'
import {
	ProductResourceNavItems,
	mobileMenuLevelMain,
	mobileMenuLevelProduct,
} from 'components/mobile-menu-levels/level-components'
// Types
import type { ProductData } from 'types/products'

/**
 * Placeholder for OpenApiDocsView mobile menu levels.
 */
export function OpenApiDocsMobileMenuLevels({
	productData,
}: {
	// Product data, used to generate mobile menu levels.
	productData: ProductData
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
							{/* Provided content for this level */}
							<div style={{ border: '1px solid magenta' }}>
								PLACEHOLDER for OpenApiDocsView mobile menu contents
							</div>
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
