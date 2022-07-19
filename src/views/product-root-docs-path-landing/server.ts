import { GetStaticPropsContext } from 'next'
import fs from 'fs'
import path from 'path'
import slugify from 'slugify'
import { ProductData, ProductSlug, RootDocsPath } from 'types/products'
import { cachedGetProductData } from 'lib/get-product-data'
import { getStaticGenerationFunctions as _getStaticGenerationFunctions } from 'views/docs-view/server'

const generateHeadingLevelsAndSidecarHeadings = ({
	layoutHeadings,
	marketingContentBlocks = [],
	pageTitle,
}: $TSFixMe) => {
	const marketingContentHeadings = []

	// gather headings from marketing content & auto determine their levels
	let currentSectionHeading
	const marketingContentBlocksWithHeadingLevels = marketingContentBlocks.map(
		(block: $TSFixMe) => {
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
		...layoutHeadings.filter((heading: $TSFixMe) => heading.level !== 1),
	]

	return { sidecarHeadings, marketingContentBlocksWithHeadingLevels }
}

/**
 * Generates all /:productSlug/:rootDocsPath paths from the current config's
 * beta_product_slugs array.
 *
 * For each beta product slug, first the product's data is loaded from its
 * associated src/data JSON file. Then, for each object in the product's
 * `rootDocsPath` array, a path with two params is added to the result array
 * (`productSlug` and `rootDocsPath`).
 */
const generateRootDocsLandingPaths = () => {
	const paths = []

	const betaProductSlugs = __config.dev_dot.beta_product_slugs
	betaProductSlugs.forEach((productSlug: ProductSlug) => {
		const productData = cachedGetProductData(productSlug as ProductSlug)
		productData.rootDocsPaths.forEach((rootDocsPath: RootDocsPath) => {
			paths.push({
				params: { productSlug, rootDocsPath: rootDocsPath.path },
			})
		})
	})

	return paths
}

const generateRootDocsLandingProps = async ({
	context,
	product,
	rootDocsPathSlug,
}: {
	context: GetStaticPropsContext
	product: ProductData
	rootDocsPathSlug: string
}) => {
	/**
	 * Pull data from product object
	 */
	const currentRootDocsPath = product.rootDocsPaths.find(
		(rootDocsPath: RootDocsPath) => rootDocsPath.path === rootDocsPathSlug
	)
	const {
		shortName,
		name,
		productSlugForLoader,
		includeMDXSource = false,
	} = currentRootDocsPath
	const baseName = shortName || name

	/**
	 * Fetch page marketing content. Falls back to empty object if
	 * `src/content/${product.slug}/docs-landing.json` file is not present.
	 *
	 * Note: could consider other content sources. For now, JSON.
	 * Asana task: https://app.asana.com/0/1100423001970639/1201631159784193/f
	 */
	let CONTENT
	try {
		const jsonFilePath = path.join(
			process.cwd(),
			`src/content/${product.slug}/docs-landing/${rootDocsPathSlug}.json`
		)
		CONTENT = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'))
	} catch {
		CONTENT = {}
	}

	const { getStaticProps: generatedGetStaticProps } =
		_getStaticGenerationFunctions({
			product,
			productSlugForLoader,
			basePath: rootDocsPathSlug,
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

export { generateRootDocsLandingPaths, generateRootDocsLandingProps }
