import { productSlugsToNames } from 'lib/products'
import { CommandBarLinkListItem } from 'components/command-bar/components'
import { DocumentationHitObject, DocumentationHitProps } from './types'

const DocumentationHit = ({ hit }: DocumentationHitProps) => {
	const { objectID, _highlightResult, product } = hit
	const { page_title, description } = _highlightResult
	const productName = product === 'hcp' ? 'HCP' : productSlugsToNames[product]

	return (
		<CommandBarLinkListItem
			title={page_title?.value}
			description={description?.value}
			url={`/${objectID}`}
			badges={productName ? [productName] : undefined}
		/>
	)
}

export type { DocumentationHitObject, DocumentationHitProps }
export default DocumentationHit
