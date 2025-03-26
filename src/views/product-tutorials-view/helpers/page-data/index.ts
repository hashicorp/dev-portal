/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { TableOfContentsHeading } from 'components/table-of-contents'
import { PageSlugOption } from 'lib/learn-client/api/page'
import { ProductViewBlock } from 'views/product-tutorials-view/components/product-view-content'
import getProductPageContent from './get-product-page-content'
import { processPageData } from './process-page-data'

/**
 * Fetch and process page data for a Tutorial product landing page.
 */
async function getProcessedPageData(
	pageSlug: PageSlugOption,
	options?: { showOverviewHeading?: boolean }
): Promise<{
	pageData: {
		blocks: ProductViewBlock[]
		showProductSitemap?: boolean
	}
	headings: TableOfContentsHeading[]
}> {
	/**
	 * Get the raw page data
	 */
	const {
		pageData: rawPageData,
		inlineCollections,
		inlineTutorials,
	} = await getProductPageContent(pageSlug)
	/**
	 * Process the page data.
	 * Includes parsing headings, for use with the page's sidecar
	 */
	const { pageData, headings } = await processPageData(
		rawPageData,
		inlineCollections,
		inlineTutorials,
		options?.showOverviewHeading
	)
	return { pageData, headings }
}
export default getProcessedPageData
