/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { TableOfContentsHeading } from 'components/table-of-contents'
import { ProductLandingViewProps } from '../types'
import { ProductLandingBlock } from '../components/product-landing-blocks/types'

/**
 * Extracts headings from product-landing page content .
 *
 * Note: could potentially use `traverse` here to make this more generic.
 * We could target any & all objects that have { heading, headingSlug }
 * However, right now that felt more opaque and cryptic than being more
 * explicit around which headings are being used and in what order.
 * As well, I think a generic implementation should better account for "level".
 * So, deferred creating a generic implementation, for now.
 */
export function extractHeadings(
	content: ProductLandingViewProps['content']
): TableOfContentsHeading[] {
	const headings: TableOfContentsHeading[] = []
	// Overview heading
	headings.push({
		title: content.overview.heading,
		slug: content.overview.headingSlug,
		level: 2,
	})
	// Get started heading, if applicable
	if (content.get_started) {
		headings.push({
			title: content.get_started.heading,
			slug: content.get_started.headingSlug,
			level: 2,
		})
	}
	// Blocks headings, where applicable
	for (const block of content.blocks) {
		if (block.type === 'heading') {
			headings.push({
				title: block.heading,
				slug: block.headingSlug,
				level: 2,
			})
		}
	}
	// Return collected headings
	return headings
}
