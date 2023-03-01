/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProductPageBlock as LearnClientProductPageBlock } from 'lib/learn-client/types'
import { TableOfContentsHeading } from 'components/table-of-contents'
import { ProductViewBlock } from '../../components/product-view-content'
import {
	addHeadingSlugsToBlocks,
	buildLayoutHeadings,
} from '../heading-helpers'
import { InlineCollections, InlineTutorials } from '../get-inline-content'
import { enrichLearnData } from './enrich-learn-data'
import { fixBrandedCalloutUrls } from './fix-branded-callout-urls'

/**
 * Fix up product tutorials view page data
 * before sending it to the client.
 */
export async function processPageData(
	rawPageData: {
		blocks: LearnClientProductPageBlock[]
		showProductSitemap?: boolean
	},
	inlineCollections: InlineCollections,
	inlineTutorials: InlineTutorials,
	showOverviewHeading?: boolean
): Promise<{
	pageData: {
		blocks: ProductViewBlock[]
		showProductSitemap?: boolean
	}
	headings: TableOfContentsHeading[]
}> {
	/**
	 * Enrich the raw blocks with Learn data,
	 * replacing tutorial and collection slugs with exactly
	 * the data needed to render front-end components.
	 */
	const withTutorialData = enrichLearnData(
		rawPageData.blocks,
		inlineCollections,
		inlineTutorials
	)
	/**
	 * Adds unique heading slugs to specific blocks.
	 * Required to generate our table-of-contents headings, with valid links.
	 */
	const withHeadingSlugs = addHeadingSlugsToBlocks(withTutorialData)
	/**
	 * Fix up URLs for branded callouts.
	 * TODO: should be possible to remove this, once URLs are updated in source.
	 * Task: https://app.asana.com/0/1202097197789424/1203347809732589/f
	 */
	const withFixedUrls = await fixBrandedCalloutUrls(withHeadingSlugs)
	/**
	 * Collect processed page data
	 */
	const pageData = {
		blocks: withFixedUrls,
		showProductSitemap: rawPageData.showProductSitemap,
	}
	/**
	 * Build headings for the layout, based on pageData.
	 */
	const headings = buildLayoutHeadings(pageData, showOverviewHeading)
	return { pageData, headings }
}
