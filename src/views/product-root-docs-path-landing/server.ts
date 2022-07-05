import slugify from 'slugify'
import { GetStaticPropsContext } from 'next'
import { RootDocsPath } from 'types/products'
import { getStaticGenerationFunctions as _getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import { GenerateGetStaticPropsArguments } from './types'

/**
 * @TODO add TS to function signature & document function purpose
 */
const generateHeadingLevelsAndSidecarHeadings = ({
	layoutHeadings,
	marketingContentBlocks,
	pageTitle,
}) => {
	const marketingContentHeadings = []

	// gather headings from marketing content & auto determine their levels
	let currentSectionHeading
	const marketingContentBlocksWithHeadingLevels = marketingContentBlocks.map(
		(block) => {
			const blockCopy = { ...block }

			let thisHeadingObject

			if (block.type === 'section-heading') {
				// all section-heading block types are supposed to be h2's
				const headingSlug = slugify(block.title, { lower: true })
				thisHeadingObject = {
					level: 2,
					title: block.title,
					id: headingSlug,
					slug: headingSlug,
				}
				currentSectionHeading = thisHeadingObject
			} else if (block.type === 'card-grid') {
				// all card-grid headings will be h3's unless a section-heading is before it
				let cardGridHeadingLevel
				if (currentSectionHeading) {
					cardGridHeadingLevel = currentSectionHeading.level + 1
				} else {
					cardGridHeadingLevel = 2
				}

				const headingSlug = slugify(block.title, { lower: true })
				thisHeadingObject = {
					level: cardGridHeadingLevel,
					title: block.title,
					id: headingSlug,
					slug: headingSlug,
				}
			}

			if (thisHeadingObject) {
				marketingContentHeadings.push(thisHeadingObject)
				blockCopy.headingLevel = thisHeadingObject.level
				blockCopy.headingId = thisHeadingObject.id
			}

			return blockCopy
		}
	)

	// build page title heading element
	const titleHeadingSlug = slugify(pageTitle, { lower: true })
	const titleHeading = {
		level: 1,
		id: titleHeadingSlug,
		slug: titleHeadingSlug,
		title: pageTitle,
	}

	// piece together the different headings
	const sidecarHeadings = [
		titleHeading,
		...marketingContentHeadings,
		...layoutHeadings.filter((heading) => heading.level !== 1),
	]

	return { sidecarHeadings, marketingContentBlocksWithHeadingLevels }
}

const generateGetStaticProps = ({
	includeMDXSource = false,
	pageContent,
	product,
	productSlugForLoader,
}: GenerateGetStaticPropsArguments) => {
	const basePath = 'docs'
	const currentRootDocsPath = product.rootDocsPaths.find(
		(rootDocsPath: RootDocsPath) => rootDocsPath.path === basePath
	)
	const baseName = currentRootDocsPath.shortName

	return async (context: GetStaticPropsContext) => {
		const { getStaticProps: generatedGetStaticProps } =
			_getStaticGenerationFunctions({
				product,
				productSlugForLoader,
				basePath,
				baseName,
			})

		// TODO: replace any with accurate type
		const generatedProps = (await generatedGetStaticProps({
			...context,
			params: { page: [] },
		})) as $TSFixMe

		// Append headings found in marketing content
		const { sidecarHeadings, marketingContentBlocksWithHeadingLevels } =
			generateHeadingLevelsAndSidecarHeadings({
				layoutHeadings: generatedProps.props.layoutProps.headings,
				marketingContentBlocks: pageContent.marketingContentBlocks,
				pageTitle: `${product.name} ${baseName}`,
			})

		// TODO clean this up so it's easier to understand
		return {
			...generatedProps,
			props: {
				...generatedProps.props,
				mdxSource: includeMDXSource ? generatedProps.props.mdxSource : null,
				layoutProps: {
					...generatedProps.props.layoutProps,
					githubFileUrl: null,
					headings: sidecarHeadings,
				},
				pageContent: {
					...pageContent,
					marketingContentBlocks: marketingContentBlocksWithHeadingLevels,
				},
				pageHeading: sidecarHeadings[0],
				product: {
					...generatedProps.props.product,
					currentRootDocsPath,
				},
			},
		}
	}
}

export { generateGetStaticProps }
