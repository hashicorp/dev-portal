/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { productSlugsToNames } from 'lib/products'
import { ProductOption } from 'lib/learn-client/types'
import { TutorialHitObject, TutorialHitProps } from './types'
import { getTutorialSlug } from 'views/collection-view/helpers'
import { UnifiedSearchLinkListItem } from '../unified-search-list-item'

const IS_DEV = process.env.NODE_ENV !== 'production'

const TutorialHit = ({ hit }: TutorialHitProps) => {
	const { _highlightResult, products, defaultContext, slug } = hit

	/**
	 * If the hit isn't a `tutorial`, don't render it
	 */
	if (hit.type !== 'tutorial') {
		// if (IS_DEV) {
		// 	console.warn(
		// 		'[TutorialHit] Found a `hit` thats not a tutorial:\n',
		// 		JSON.stringify(hit, null, 2)
		// 	)
		// }

		return null
	}

	/**
	 * If no _highlightResult, the hit is likely invalid and links to a page that
	 * doesn't exist. So we log a dev warning and return `null`.
	 */
	if (!_highlightResult) {
		if (IS_DEV) {
			console.warn(
				'[TutorialHit] Found a `hit` with no `_highlightResult`:\n',
				JSON.stringify(hit, null, 2)
			)
		}

		return null
	}

	const { page_title, description } = _highlightResult

	/**
	 * If the `_highlightResult` has neither a name or description, there is
	 * nothing to render for the result.
	 */
	if (!page_title && !description) {
		if (IS_DEV) {
			console.warn(
				'[TutorialHit] Found a `hit` with no `name` or `description` in `_highlightResult`:\n',
				JSON.stringify(hit, null, 2)
			)
		}

		return null
	}

	const badges = products?.map(
		(productSlug: ProductOption) => productSlugsToNames[productSlug]
	)

	const resultUrl = getTutorialSlug(slug, defaultContext.slug)

	return (
		<UnifiedSearchLinkListItem
			title={page_title?.value}
			description={description?.value}
			url={resultUrl}
			badges={badges}
		/>
	)
}

export type { TutorialHitObject, TutorialHitProps }
export default TutorialHit
