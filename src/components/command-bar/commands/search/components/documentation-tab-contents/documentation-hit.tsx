import { productSlugsToNames } from 'lib/products'
import { CommandBarLinkListItem } from 'components/command-bar/components'
import { DocumentationHitObject, DocumentationHitProps } from './types'

/**
 * @TODO import this from the source:
 * https://github.com/hashicorp/web-platform-packages/blob/main/packages/remark-plugins/util/generate-slug.js
 */
const generateHeadingSlug = (heading, allHeadingLinks = []) => {
	let slug = heading
		.toLowerCase()
		.trim()
		.replace(/<\/?[^>]*>/g, '') // Strip links
		.replace(/\(\(#.*?\)\)/g, '') // Strip anchor link aliases
		.replace(/\W+/g, '-') // Whitespace to '-'
		.replace(/-+/g, '-') // Collapse more than one '-'
		.replace(/^-/g, '') // Remove leading '-'
		.replace(/-$/g, '') // Remove trailing '-'

	// count if there are any duplicates on the page
	const dupeCount = allHeadingLinks.reduce((m, i) => {
		if (slug === i) {
			m++
		}
		return m
	}, 0)
	allHeadingLinks.push(slug)

	// append the count to the end of the slug if necessary
	if (dupeCount > 0) {
		slug = `${slug}-${dupeCount}`
	}

	return slug
}

const generateDocumentationHitUrl = (hit: DocumentationHitObject) => {
	let url = `/${hit.objectID.replace(/\/index$/, '')}`

	const titleDoesNotMatch =
		hit._highlightResult?.page_title?.matchLevel === 'none'
	const descriptionDoesNotMatch =
		hit._highlightResult?.description?.matchLevel === 'none'
	if (titleDoesNotMatch && descriptionDoesNotMatch) {
		const headingSlugs = []
		const matchingHeadingSlugs = []

		hit._highlightResult?.headings?.forEach((headingHighlightResult, index) => {
			const headingSlug = generateHeadingSlug(
				hit?.headings[index],
				headingSlugs
			)
			if (headingHighlightResult?.matchLevel !== 'none') {
				matchingHeadingSlugs.push(headingSlug)
			}
		})

		if (matchingHeadingSlugs?.length === 1) {
			url = `${url}#${generateHeadingSlug(matchingHeadingSlugs[0])}`
		}
	}

	return url
}

const DocumentationHit = ({ hit }: DocumentationHitProps) => {
	const { _highlightResult, product } = hit
	const { page_title, description } = _highlightResult
	const productName = product === 'hcp' ? 'HCP' : productSlugsToNames[product]
	const url = generateDocumentationHitUrl(hit)

	console.log({ url })

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
