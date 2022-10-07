import { productSlugsToNames } from 'lib/products'
import { CommandBarLinkListItem } from 'components/command-bar/components'
import { ProductSlug } from 'types/products'
import { TutorialHitObject, TutorialHitProps } from './types'

const IS_DEV = process.env.NODE_ENV !== 'production'

const TutorialHit = ({ hit }: TutorialHitProps) => {
	const { _highlightResult, products, defaultContext, slug } = hit

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

	const { name, description } = _highlightResult

	/**
	 * If the `_highlightResult` has neither a name or description, there is
	 * nothing to render for the result.
	 */
	if (!name && !description) {
		if (IS_DEV) {
			console.warn(
				'[TutorialHit] Found a `hit` with no `name` or `description` in `_highlightResult`:\n',
				JSON.stringify(hit, null, 2)
			)
		}

		return null
	}

	const badges = products?.map(
		(productSlug: ProductSlug) => productSlugsToNames[productSlug]
	)
	const [productSlug, collectionSlug] = defaultContext.slug.split('/')
	const [, tutorialSlug] = slug.split('/')
	const resultUrl = `/${
		productSlug === 'cloud' ? 'hcp' : productSlug
	}/tutorials/${collectionSlug}/${tutorialSlug}`

	return (
		<CommandBarLinkListItem
			title={name?.value}
			description={description?.value}
			url={resultUrl}
			badges={badges}
		/>
	)
}

export type { TutorialHitObject, TutorialHitProps }
export default TutorialHit
