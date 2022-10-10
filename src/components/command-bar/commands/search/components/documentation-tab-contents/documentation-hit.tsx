import { productSlugsToNames } from 'lib/products'
import { CommandBarLinkListItem } from 'components/command-bar/components'
import { DocumentationHitObject, DocumentationHitProps } from './types'

const IS_DEV = process.env.NODE_ENV !== 'production'

/**
 * @TODO - does not yet handle linking to specific headings.
 */
const generateDocumentationHitUrl = (hit: DocumentationHitObject) => {
	return `/${hit.objectID.replace(/\/index$/, '')}`
}

const DocumentationHit = ({ hit }: DocumentationHitProps) => {
	const { _highlightResult, product } = hit

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

	/**
	 * If the `_highlightResult` has neither a page_title or description, there is
	 * nothing to render for the result.
	 */
	if (!page_title && !description) {
		if (IS_DEV) {
			console.warn(
				'[DocumentationHit] Found a `hit` with no `page_title` or `description` in `_highlightResult`:\n',
				JSON.stringify(hit, null, 2)
			)
		}

		return null
	}

	const productName = product === 'hcp' ? 'HCP' : productSlugsToNames[product]
	const url = generateDocumentationHitUrl(hit)

	return (
		<CommandBarLinkListItem
			title={page_title?.value}
			description={description?.value}
			url={url}
			badges={productName ? [productName] : undefined}
		/>
	)
}

export type { DocumentationHitObject, DocumentationHitProps }
export default DocumentationHit
