import fs from 'fs'
import path from 'path'
import slugify from 'slugify'
import { GetStaticPropsContext } from 'next'
import { ProductSlug, RootDocsPath } from 'types/products'
import { cachedGetProductData } from 'lib/get-product-data'
import { getStaticGenerationFunctions as _getStaticGenerationFunctions } from 'views/docs-view/server'
import {
	GETTING_STARTED_CARD_HEADING,
	GETTING_STARTED_CARD_HEADING_SLUG,
} from './components/marketing-content'
import { prepareMarketingBlocks } from './utils/prepare-marketing-blocks'

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
			} else if (block.type === 'getting-started-card') {
				const headingSlug = GETTING_STARTED_CARD_HEADING_SLUG
				thisHeadingObject = {
					level: 2,
					title: GETTING_STARTED_CARD_HEADING,
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

const getStaticProps = async (context: GetStaticPropsContext) => {
	// Constants
	const basePath = 'docs'

	// Fetch product data
	const productSlug = context.params.productSlug as string
	const product = cachedGetProductData(productSlug as ProductSlug)

	// Pull properties from product data
	const currentRootDocsPath = product.rootDocsPaths.find(
		(rootDocsPath: RootDocsPath) => rootDocsPath.path === basePath
	)
	const {
		includeMDXSource = false,
		name,
		productSlugForLoader = product.slug,
		shortName,
	} = currentRootDocsPath
	const baseName = shortName || name

	// Fetch page content
	const jsonFilePath = path.join(
		process.cwd(),
		`src/content/${product.slug}/docs-landing.json`
	)
	const pageContent = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'))

	// Generate getStaticProps from DocsView helper
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
			layoutHeadings: includeMDXSource
				? generatedProps.props.layoutProps.headings
				: [],
			marketingContentBlocks: pageContent.marketingContentBlocks,
			pageTitle: `${product.name} ${baseName}`,
		})

	/**
	 * Prepare marketing content blocks for client use
	 */
	const preparedMarketingBlocks = await prepareMarketingBlocks(
		marketingContentBlocksWithHeadingLevels
	)

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
				marketingContentBlocks: preparedMarketingBlocks,
			},
			pageHeading: sidecarHeadings[0],
			product: {
				...generatedProps.props.product,
				currentRootDocsPath,
			},
		},
	}
}

export { getStaticProps }
