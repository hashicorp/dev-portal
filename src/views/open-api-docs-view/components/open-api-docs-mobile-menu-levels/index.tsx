/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

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
							{/* API docs mobile menu contents */}
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
