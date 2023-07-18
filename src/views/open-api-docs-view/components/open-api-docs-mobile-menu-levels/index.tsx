// Product data
import HCP_PRODUCT_DATA from 'data/hcp.json'
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
 * Placeholder global product data, should get from getStaticProps
 * instead, I think.
 *
 * TODO: get from getStaticProps, pass into this component
 */
const PRODUCT_DATA = HCP_PRODUCT_DATA as ProductData

/**
 * Placeholder for OpenApiDocsView mobile menu levels.
 */
export function OpenApiDocsMobileMenuLevels() {
	return (
		<MobileMenuLevels
			levels={[
				mobileMenuLevelMain(),
				mobileMenuLevelProduct(PRODUCT_DATA),
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
							<ProductResourceNavItems slug={PRODUCT_DATA.slug} />
						</div>
					),
				},
			]}
		/>
	)
}
