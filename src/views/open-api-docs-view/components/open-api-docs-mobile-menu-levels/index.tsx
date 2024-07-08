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
import OpenApiSidebarContents from 'components/open-api-sidebar-contents'
// Types
import type { ProductData } from 'types/products'
import type { OpenApiNavItem } from 'views/open-api-docs-view/types'

/**
 * Placeholder for OpenApiDocsView mobile menu levels.
 */
export function OpenApiDocsMobileMenuLevels({
	productData,
	navItems,
	navResourceItems,
}: {
	// Product data, used to generate mobile menu levels.
	productData: ProductData
	navItems: OpenApiNavItem[]
	navResourceItems: OpenApiNavItem[]
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
							<OpenApiSidebarContents
								navItems={navItems}
								navResourceItems={navResourceItems}
							/>
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
