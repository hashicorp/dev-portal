import { productSlugsToNames } from 'lib/products'
import { CommandBarLinkListItem } from 'components/command-bar/components'
import { DocumentationHitObject, DocumentationHitProps } from './types'

const IS_DEV = process.env.NODE_ENV !== 'production'

const DocumentationHit = ({ hit }: DocumentationHitProps) => {
	const { objectID, _highlightResult, product } = hit

	/**
	 * If no _highlightResult, the hit is likely invalid and links to a page that
	 * doesn't exist. So we log a dev warning and return `null`.
	 */
	if (!_highlightResult) {
		if (IS_DEV) {
			console.warn(
				'[DocumentationHit] Found a `hit` with no `_highlightResult`:\n',
				JSON.stringify(hit, null, 2)
			)
		}

		return null
	}

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
