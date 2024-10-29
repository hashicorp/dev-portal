/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import fs from 'fs'
import path from 'path'
import slugify from 'slugify'
import { GetStaticPropsContext } from 'next'
import { ProductSlug, RootDocsPath } from 'types/products'
import { cachedGetProductData } from 'lib/get-product-data'
import outlineItemsFromHeadings from 'components/outline-nav/utils/outline-items-from-headings'
import { getStaticGenerationFunctions as _getStaticGenerationFunctions } from 'views/docs-view/server'
import {
	GETTING_STARTED_CARD_HEADING,
	GETTING_STARTED_CARD_HEADING_SLUG,
} from './components/marketing-content'
import { prepareMarketingBlocks } from './utils/prepare-marketing-blocks'
import { ProductRootDocsPathLandingProps } from './types'

/**
 * @TODO add TS to function signature & document function purpose
 */
const generateHeadingLevelsAndSidecarHeadings = ({
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
	const sidecarHeadings = [titleHeading, ...marketingContentHeadings]

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

	const basePathForLoader =
		currentRootDocsPath.basePathForLoader || currentRootDocsPath.path

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
			basePathForLoader,
			baseName,
		})
	const getStaticPropsResult = await generatedGetStaticProps({
		...context,
		params: { page: [] },
	})

	/**
	 * Our base `generatedGetStaticProps` could technically return
	 * a redirect or not-found. We should account for these cases.
	 * This also serves as a type guard.
	 */
	if (!('props' in getStaticPropsResult)) {
		return getStaticPropsResult
	}

	/**
	 * TODO: Remove this when (HCP) Waypoint IA is updated
	 */
	if (product.slug === 'waypoint') {
		getStaticPropsResult.props.layoutProps['sidebarNavDataLevels'] =
			getStaticPropsResult.props.layoutProps.sidebarNavDataLevels.map(
				(navLevel) => {
					delete navLevel.menuItems
					return {
						...navLevel,
						showFilterInput: false,
					}
				}
			)
	}

	/**
	 * Grab the outline from the MDX content, if applicable.
	 *
	 * Note we slice off the first outline item, we expect it to be an <h1 />,
	 * which would be duplicative in this context.
	 */
	const mdxOutline = includeMDXSource
		? getStaticPropsResult.props.outlineItems.slice(1)
		: []

	/**
	 * Append headings found in marketing content.
	 */
	const { sidecarHeadings, marketingContentBlocksWithHeadingLevels } =
		generateHeadingLevelsAndSidecarHeadings({
			marketingContentBlocks: pageContent.marketingContentBlocks,
			pageTitle: `${product.name} ${baseName}`,
		})

	/**
	 * Prepare marketing content blocks for client use
	 */
	const preparedMarketingBlocks = await prepareMarketingBlocks(
		marketingContentBlocksWithHeadingLevels
	)

	/**
	 * Transform sidecarHeadings into outlineItems, and pageHeading
	 */
	const firstHeading = sidecarHeadings[0]
	const pageHeading = { id: firstHeading.id, title: firstHeading.title }
	const outlineItems = [
		...outlineItemsFromHeadings(sidecarHeadings),
		...mdxOutline,
	]

	/**
	 * Declare props with type for type safety
	 *
	 * TODO: ideally we'd declare this typing as part of the return type
	 * of this function. For now, this is a step in that direction.
	 */
	const props: ProductRootDocsPathLandingProps = {
		...getStaticPropsResult.props,
		mdxSource: includeMDXSource ? getStaticPropsResult.props.mdxSource : null,
		layoutProps: {
			...getStaticPropsResult.props.layoutProps,
			githubFileUrl: null,
		},
		pageContent: {
			...pageContent,
			marketingContentBlocks: preparedMarketingBlocks,
		},
		pageHeading,
		outlineItems,
		product: {
			...getStaticPropsResult.props.product,
			currentRootDocsPath,
		},
	}

	// TODO clean this up so it's easier to understand
	return {
		...getStaticPropsResult,
		props,
	}
}

export { getStaticProps }
