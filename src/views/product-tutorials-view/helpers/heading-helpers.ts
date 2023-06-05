/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import slugify from 'slugify'
import { TableOfContentsHeading } from 'components/table-of-contents'
import { ProductViewBlock } from '../components/product-view-content'
import { LearnClientProductPageBlockEnriched } from './page-data/enrich-learn-data'

/**
 * Given pageData for product view,
 * as well as a productName,
 *
 * Return an array of Sidecar-compatible
 * TableOfContentsHeading objects, each representing
 * a section that will be rendered on the page.
 */
function buildLayoutHeadings(
	pageData: {
		blocks: ProductViewBlock[]
		showProductSitemap?: boolean
	},
	showOverviewHeading?: boolean
): TableOfContentsHeading[] {
	const { blocks, showProductSitemap } = pageData

	/**
	 * Build an <h1> overview heading
	 */
	const overviewHeading = showOverviewHeading ? [getOverviewHeading()] : []

	/**
	 * Extract headings from each block
	 */
	const blockHeadings = blocks.reduce(
		(acc: TableOfContentsHeading[], block: ProductViewBlock) => {
			if (isReadyForTableOfContents(block)) {
				acc.push({
					title: block.heading,
					slug: block.headingSlug,
					level: 2,
				})
			}
			return acc
		},
		[]
	)

	/**
	 * If there's a product sitemap, build add a heading item for it
	 */
	const sitemapHeading = showProductSitemap ? [getSitemapHeading()] : []

	/**
	 * Flatten the array of headings, and return them
	 */
	return [...overviewHeading, ...blockHeadings, ...sitemapHeading]
}

/**
 * Check if a block has a heading,
 * and is a block type we want to show in the table of contents,
 * in which case we can generate a headingSlug for it
 */
function isIntendedForTableOfContents<
	T extends { type: string; heading?: unknown }
>(block: T): block is T & { heading: string } {
	const isTargetType =
		block.type == 'CollectionsStack' ||
		block.type == 'FeaturedStack' ||
		block.type == 'TutorialsStack'
	return isTargetType && typeof block.heading == 'string'
}

/**
 * Check if a block can be added to the table of contents
 */
function isReadyForTableOfContents<
	T extends { type: string; heading?: unknown; headingSlug?: unknown }
>(block: T): block is T & { heading: string; headingSlug: string } {
	return (
		isIntendedForTableOfContents(block) && typeof block.headingSlug == 'string'
	)
}

/**
 * Given a productName,
 * return a TableOfContentsHeading object
 * representing a top-level heading for a product tutorials view
 */
function getOverviewHeading(): TableOfContentsHeading {
	return { title: 'Overview', slug: 'overview', level: 1 }
}

/**
 * Return a TableOfContentsHeading object
 * representing a heading for a sitemap section
 * on a product tutorials view
 */
function getSitemapHeading(): TableOfContentsHeading {
	return { title: 'All Tutorials', slug: 'all-tutorials', level: 2 }
}

/**
 * Adds "headingSlug" properties to all blocks with defined "heading"
 */
function addHeadingSlugsToBlocks(
	blocks: LearnClientProductPageBlockEnriched[]
): ProductViewBlock[] {
	const blocksWithHeadings = blocks.map(
		(block: LearnClientProductPageBlockEnriched) => {
			if (!isIntendedForTableOfContents(block)) {
				return block
			}
			const headingSlug = slugify(block.heading, { lower: true })
			return { ...block, headingSlug }
		}
	)
	// Return the page data with these new blocks
	return blocksWithHeadings
}

export {
	addHeadingSlugsToBlocks,
	buildLayoutHeadings,
	getOverviewHeading,
	getSitemapHeading,
}
