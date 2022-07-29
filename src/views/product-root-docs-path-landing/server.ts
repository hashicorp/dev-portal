import fs from 'fs'
import path from 'path'
import slugify from 'slugify'
import { GetStaticPropsContext } from 'next'
import { ProductSlug, RootDocsPath } from 'types/products'
import { cachedGetProductData } from 'lib/get-product-data'
import { getStaticGenerationFunctions as _getStaticGenerationFunctions } from 'views/docs-view/server'

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

	// TODO clean this up so it's easier to understand
	return {
		...generatedProps,
		props: {
			...generatedProps.props,
			/**
			 * TODO: when running locally, quirky behaviour with Terraform docs.
			 * Details on a temporary workaround to stop things from breaking below.
			 *
			 * NextJS seems to initially load `/terraform/docs` using the page file
			 * `src/pages/[productSlug]/docs/index.tsx` as expected. However,
			 * after a short time, and on client-side navigation to `terraform/docs`,
			 * NextJS seems to switch to loading the same page using the page file
			 * `src/pages/terraform/[rootDocsPath]/index.tsx`, even though this
			 * latter page file explicitly does not list "docs" in getStaticPaths.
			 *
			 * As a result, if `mdxSource` is undefined, when rendering with the
			 * latter page file we see a critical client-side error. By ensuring
			 * `mdxSource` is always defined, we sidestep this issue somewhat.
			 *
			 * TODO: this a temporary solution while I figure out how to work
			 * around this properly. I'm curious whether I'll see this same behaviour
			 * in deploy previews, not just local development. This also feels like
			 * a bit of a bug in NextJS - it seems like NextJS should either be able
			 * to distinguish which page file to use in an unambiguous, consistent
			 * way, or should be able to warn me if it can't do that rather than
			 * switching up the page file depending on client-side vs hard reload
			 * rendering (and even switching it up in dev after zero user input).
			 *
			 * For posterity, previously we did not pass `includeMDXSource` to the
			 * client, and instead did the following:
			 * mdxSource: includeMdxSource ? generatedProps.props.mdxSource : null,
			 */
			includeMDXSource,
			mdxSource: generatedProps.props.mdxSource,
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

export { getStaticProps }
