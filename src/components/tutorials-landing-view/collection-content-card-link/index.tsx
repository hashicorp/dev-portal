import { getCollectionSlug } from 'views/collection-view/helpers'
import { type CollectionContentCardLinkProps } from '../types'
import ContentCardLink from '../content-card-link'
import { BADGE_ICON_MAP, PRODUCT_SLUGS_TO_HEADER_IMAGES } from './constants'

const CollectionContentCardLink = ({
	productSlug,
	collection,
}: CollectionContentCardLinkProps) => {
	const title = collection.name
	const description = collection.description
	const headerImageUrl = PRODUCT_SLUGS_TO_HEADER_IMAGES[productSlug]
	const href = getCollectionSlug(collection.slug)

	const tutorialCount = collection.tutorials.length
	const eyebrowParts = [
		'Learning path',
		`${tutorialCount} tutorial${tutorialCount > 1 ? 's' : ''}`,
	]

	let hasVideo = false
	let hasLab = false
	const productsUsed = new Set([productSlug])

	collection.tutorials.forEach((tutorial) => {
		if (!hasVideo && Boolean(tutorial.video)) {
			hasVideo = true
		}
		if (!hasLab && Boolean(tutorial.handsOnLab)) {
			hasLab = true
		}
		tutorial.productsUsed.forEach((productUsed) => {
			productsUsed.add(productUsed.product.slug)
		})
	})

	const badges = []
	productsUsed.forEach((productUsed) =>
		badges.push(BADGE_ICON_MAP[productUsed])
	)
	if (hasVideo) {
		badges.push(BADGE_ICON_MAP.video)
	}
	if (hasLab) {
		badges.push(BADGE_ICON_MAP.interactive)
	}

	return (
		<ContentCardLink
			badges={badges}
			description={description}
			headerImageUrl={headerImageUrl}
			href={href}
			title={title}
			eyebrowParts={eyebrowParts}
		/>
	)
}

export default CollectionContentCardLink
