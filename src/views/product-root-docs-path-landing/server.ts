import fs from 'fs'
import path from 'path'
import slugify from 'slugify'
import { GetStaticPropsContext } from 'next'
import { ProductSlug, RootDocsPath } from 'types/products'
import { getStaticGenerationFunctions as _getStaticGenerationFunctions } from 'views/docs-view/server'
import { GenerateGetStaticPropsOptions } from './types'

const BASE_PATH = 'docs'

const OPTION_OVERWRITES_BY_PRODUCT: {
	[key in ProductSlug]?: GenerateGetStaticPropsOptions
} = {
	hcp: {
		productSlugForLoader: 'cloud.hashicorp.com',
	},
	waypoint: {
		includeMDXSource: true,
	},
}

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

const generateGetStaticProps = () => {
	return async (context: GetStaticPropsContext) => {
		/**
		 * Pull product slug from context params
		 */
		const productSlug = context.params.productSlug as string

		/**
		 * Gather config variables
		 */
		const optionOverwrites = OPTION_OVERWRITES_BY_PRODUCT[productSlug]
		const includeMDXSource = optionOverwrites
			? optionOverwrites.includeMDXSource
			: false
		const productSlugForLoader = optionOverwrites
			? optionOverwrites.productSlugForLoader
			: undefined

		/**
		 * Fetch product data
		 */
		const productDataJsonFilePath = path.join(
			process.cwd(),
			`src/data/${productSlug}.json`
		)
		const product = JSON.parse(fs.readFileSync(productDataJsonFilePath, 'utf8'))

		/**
		 * Pull data from product object
		 */
		const currentRootDocsPath = product.rootDocsPaths.find(
			(rootDocsPath: RootDocsPath) => rootDocsPath.path === BASE_PATH
		)
		const baseName = currentRootDocsPath.shortName

		/**
		 * Fetch page content
		 *
		 * Note: could consider other content sources. For now, JSON.
		 * Asana task: https://app.asana.com/0/1100423001970639/1201631159784193/f
		 */
		const jsonFilePath = path.join(
			process.cwd(),
			`src/content/${product.slug}/docs-landing.json`
		)
		const CONTENT = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'))

		const { getStaticProps: generatedGetStaticProps } =
			_getStaticGenerationFunctions({
				product,
				productSlugForLoader,
				basePath: BASE_PATH,
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
				marketingContentBlocks: CONTENT.marketingContentBlocks,
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
					...CONTENT,
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
