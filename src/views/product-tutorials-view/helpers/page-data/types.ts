/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProductViewBlock } from '../../components/product-view-content'
import { ProductTutorialsSitemapProps } from '../../components/sitemap/types'

export interface ProductPageData {
	pageData: {
		blocks: ProductViewBlock[]
		showProductSitemap?: boolean
	}
	sitemapCollections: ProductTutorialsSitemapProps['collections']
}
