/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProductUsed, TutorialLite } from 'lib/learn-client/types'
import { normalizeSlugForDevDot } from 'lib/tutorials/normalize-product-like-slug'
import { getCollectionSlug } from 'views/collection-view/helpers'
import { trackCollectionCardLinkClicked } from 'views/tutorials-landing/analytics'
import { type CollectionContentCardLinkProps } from '../types'
import ContentCardLink from '../content-card-link'
import { BADGE_ICON_MAP, PRODUCT_SLUGS_TO_HEADER_IMAGES } from './constants'

const CollectionContentCardLink = ({
	collection,
	hideBadges,
	hideImages,
}: CollectionContentCardLinkProps) => {
	const productSlug = normalizeSlugForDevDot(collection.slug.split('/')[0])
	const href = getCollectionSlug(collection.slug)
	const title = collection.name
	const description = collection.description
	const headerImageUrl = hideImages
		? undefined
		: PRODUCT_SLUGS_TO_HEADER_IMAGES[productSlug]

	const tutorialCount = collection.tutorials.length
	const eyebrowParts = [
		'Learning path',
		`${tutorialCount} tutorial${tutorialCount != 1 ? 's' : ''}`,
	]

	let hasVideo = false
	let hasLab = false
	const productsUsed = new Set([productSlug])

	collection.tutorials.forEach((tutorial: TutorialLite) => {
		if (!hasVideo && Boolean(tutorial.video)) {
			hasVideo = true
		}
		if (!hasLab && Boolean(tutorial.handsOnLab)) {
			hasLab = true
		}
		tutorial.productsUsed.forEach((productUsed: ProductUsed) => {
			productsUsed.add(productUsed.product.slug)
		})
	})

	let badges
	if (!hideBadges) {
		badges = []
		productsUsed.forEach((productUsed: ProductUsed['product']['slug']) =>
			badges.push(BADGE_ICON_MAP[productUsed])
		)
		if (hasVideo) {
			badges.push(BADGE_ICON_MAP.video)
		}
		if (hasLab) {
			badges.push(BADGE_ICON_MAP.interactive)
		}
	}

	const handleClick = () => {
		trackCollectionCardLinkClicked({ linkPath: href, productSlug })
	}

	return (
		<ContentCardLink
			badges={badges}
			description={description}
			headerImageUrl={headerImageUrl}
			href={href}
			title={title}
			eyebrowParts={eyebrowParts}
			onClick={handleClick}
		/>
	)
}

export default CollectionContentCardLink
