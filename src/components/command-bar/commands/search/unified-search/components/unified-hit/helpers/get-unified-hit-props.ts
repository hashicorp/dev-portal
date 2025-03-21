/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Helpers
import { buildUrlPath, parseDefaultProductSlug } from '../helpers'
import { productSlugsToNames } from 'lib/products'
// Types
import type { Hit, HitAttributeHighlightResult } from 'instantsearch.js'
import type { UnifiedHitProps } from '../types'

/**
 * Given a search object Hit,
 * Return props needed to render a UnifiedHit list item
 */
export function getUnifiedHitProps(hit: Hit): UnifiedHitProps {
	// Content type, for icon
	const type = hit.type as 'docs' | 'tutorial' | 'integration' | 'knowledgebase'

	// Link attributes, href is also used for "breadcrumb"
	const ariaLabel = `${hit.page_title}. ${hit.description}`
	const href = buildUrlPath(hit)

	// Title and description
	const titleHtml = (
		hit._highlightResult.page_title as HitAttributeHighlightResult
	).value
	const descriptionHtml = (
		hit._highlightResult.description as HitAttributeHighlightResult
	).value

	// Default product
	const productSlug = parseDefaultProductSlug(hit)
	const productName =
		productSlug === 'hcp' ? 'HCP' : productSlugsToNames[productSlug]

	return {
		ariaLabel,
		descriptionHtml,
		href,
		productName,
		productSlug,
		titleHtml,
		type,
	}
}
