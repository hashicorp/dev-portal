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
import { OperationGroup } from 'views/open-api-docs-view/types'

/**
 * Placeholder for OpenApiDocsView mobile menu levels.
 */
export function OpenApiDocsMobileMenuLevels({
	productData,
	operationGroups,
}: {
	// Product data, used to generate mobile menu levels.
	productData: ProductData
	/**
	 * Operation groups, used to render the mobile.
	 * TODO: lift out logic from within OpenApiSidebarContents,
	 * that component should be more purely presentational.
	 */
	operationGroups: OperationGroup[]
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
							<OpenApiSidebarContents operationGroups={operationGroups} />
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
