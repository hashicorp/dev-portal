import { productSlugsToNames } from 'lib/products'
import { CommandBarLinkListItem } from 'components/command-bar/components'
import { ProductSlug } from 'types/products'
import { TutorialHitObject, TutorialHitProps } from './types'

const TutorialHit = ({ hit }: TutorialHitProps) => {
	const { _highlightResult, id, products, defaultContext, slug } = hit
	const { name, description } = _highlightResult
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
