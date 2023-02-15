/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import slugify from 'slugify'
import { DocsSearchHit } from '../types'

interface HitLink {
	href: { pathname: string; hash?: string }
}

/**
 * Converts an index in the form of product_PRODUCT_NAME to a product slug
 */
function getProductFromIndex(index: string) {
	return index.split('_')[1].toLowerCase()
}

export function getHitLink(hit: DocsSearchHit): HitLink {
	// @ts-expect-error -- this attribute isn't listed on the type, but it exists
	const product = getProductFromIndex(hit.__autocomplete_indexName)

	const pathname = `/${product}/${hit.objectID.replace(/\/index$/, '')}`

	const hitLink: HitLink = {
		href: {
			pathname,
		},
	}

	// We append an associated heading slug to hitLink.href if and only if the search result matches one heading
	// and does not match either description or page title criteria
	if (
		hit?._highlightResult?.description?.matchLevel === 'none' &&
		hit?._highlightResult?.page_title?.matchLevel === 'none'
	) {
		const matchedHeading = hit.headings.filter((_heading, idx) => {
			return hit?._highlightResult?.headings[idx]?.matchLevel !== 'none'
		})

		if (matchedHeading.length === 1) {
			hitLink.href.hash = slugify(matchedHeading[0], { lower: true })
		}
	}

	return hitLink
}
