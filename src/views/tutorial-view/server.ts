/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import moize, { Options } from 'moize'
import { LearnProductData } from 'types/products'

import {
	getAllCollections,
	getNextCollectionInSidebar,
} from 'lib/learn-client/api/collection'
import { getTutorial } from 'lib/learn-client/api/tutorial'
import {
	Collection as ClientCollection,
	ProductOption,
	TutorialLite as ClientTutorialLite,
	Product as LearnClientProduct,
} from 'lib/learn-client/types'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { splitProductFromFilename } from './utils'
import { serializeContent } from './utils/serialize-content'
import { TutorialViewProps } from '.'
import {
	getCollectionContext,
	getCurrentCollectionTutorial,
} from './utils/get-collection-context'
import { getTutorialsBreadcrumb } from './utils/get-tutorials-breadcrumb'
import { getCollectionViewSidebarSections } from 'views/collection-view/server'
import { normalizeSlugForTutorials } from 'lib/tutorials/normalize-product-like-slug'
import { normalizeSlugForDevDot } from 'lib/tutorials/normalize-product-like-slug'
import outlineItemsFromHeadings from 'components/outline-nav/utils/outline-items-from-headings'
import {
	TutorialVariantOption,
	getTutorialViewVariantData,
	getVariantParam,
} from './utils/variants'
import { isCertificationSlug } from 'lib/utils'

/**
 * Given a ProductData object (imported from src/data JSON files) and a tutorial
 * slug, fetches and returns the page props for
 * `/{productSlug}/tutorials/{collectionSlug}/{tutorialSlug}` pages.
 *
 * Returns the given ProductData object unmodified as the `product` page prop,
 * which is needed for other areas of the app to function.
 */
export async function getTutorialPageProps(
	/**
	 * @TODO clean up the hcp / learn product slug types https://app.asana.com/0/1202097197789424/1202946807363608
	 */
	product: Omit<LearnProductData, 'slug'> & {
		slug: LearnClientProduct['slug'] | 'hcp'
	},
	fullSlug: [string, string] | [string, string, string] // Third option is a variant
): Promise<{ props: TutorialViewProps } | null> {
	// Remove the variant from the slug
	const slug = fullSlug.slice(0, 2) as [string, string]

	// product.slug may be "hcp", needs to be "cloud" for Learn API use
	const learnProductSlug = normalizeSlugForTutorials(product.slug)
	const { collection, tutorialReference } = await getCurrentCollectionTutorial(
		learnProductSlug as ProductOption,
		slug
	)

	// the tutorial doesn't exist in collection - return 404
	if (tutorialReference.dbSlug === null || collection.data === null) {
		return null
	}

	const fullTutorialData = await getTutorial(tutorialReference.dbSlug)
	// double guard if tutorial doesn't exist after call - return 404
	if (fullTutorialData === null) {
		return null
	}

	const variantSlug = fullSlug[2]
	const variant = getTutorialViewVariantData(
		variantSlug,
		fullTutorialData.variant
	)

	const { content: serializedContent, headings } = await serializeContent(
		fullTutorialData
	)
	const collectionContext = getCollectionContext(
		collection.data,
		fullTutorialData.collectionCtx
	)
	/**
	 * @TODO this helper makes an API call to fetch all collections for the
	 * current product. We plan to refactor the code in such a way so that this
	 * API call is deferred to the client-side only when the data is needed to be
	 * viewed. In this view, that means: on mobile, after opening the Sidebar, and
	 * after clicking the level-up button at the top of the Sidebar.
	 */
	const sidebarSections = await getCollectionViewSidebarSections(
		product.slug,
		collection.data
	)
	const layoutProps = {
		breadcrumbLinks: getTutorialsBreadcrumb({
			product: { name: product.name, filename: product.slug },
			collection: {
				name: collection.data.shortName,
				filename: collection.filename,
			},
			tutorial: {
				name: fullTutorialData.shortName,
				filename: tutorialReference.filename,
			},
		}),
		sidebarSections,
		/* Long-form content pages use a narrower main area width */
		mainWidth: 'narrow' as const,
		isCertificationPrep: isCertificationSlug(collection.data.slug),
	}
	const lastTutorialIndex = collectionContext.current.tutorials.length - 1
	const isLastTutorial =
		collectionContext.current.tutorials[lastTutorialIndex].id ===
		fullTutorialData.id

	let nextCollection = undefined

	if (isLastTutorial) {
		nextCollection = await getNextCollectionInSidebar({
			product: product.slug as ProductOption,
			after: collectionContext.current.slug,
		})
	}

	return {
		props: stripUndefinedProperties<TutorialViewProps>({
			metadata: {
				title: fullTutorialData.name,
				description: fullTutorialData.description,
				variant,
			},
			tutorial: {
				...fullTutorialData,
				content: serializedContent,
				collectionCtx: collectionContext,
				nextCollectionInSidebar:
					collectionContext.current.nextCollection ?? nextCollection,
			},
			pageHeading: {
				slug: headings[0].slug,
				text: fullTutorialData.name,
			},
			outlineItems: outlineItemsFromHeadings(headings),
			product,
			layoutProps,
			nextCollection,
		}),
	}
}

export interface TutorialPagePaths {
	params: {
		productSlug: string
		tutorialSlug: string[]
	}
}

const moizeOpts: Options = {
	isPromise: true,
	maxSize: Infinity,
	isDeepEqual: true,
}
// limit the expensive call for tutorials that have the same product
const cachedGetAllCollections = moize(getAllCollections, moizeOpts)

/**
 * These paths are built with the collection slug as context for truth.
 * A tutorial may belong to many different collections and be housed in a different
 * product context. We build the path using the collection's product association
 * for the proper slug context.
 * Final route — :productSlug/tutorials/:collectionFilename/:tutorialFilename
 */

export async function getTutorialPagePaths(): Promise<TutorialPagePaths[]> {
	const allCollections = await cachedGetAllCollections()
	const paths = []

	allCollections.forEach((collection: ClientCollection) => {
		// assuming slug structure of :product/:filename
		const [productSlugFromCollection, collectionSlug] =
			collection.slug.split('/')
		/**
		 * Only build collections where the `productSlug` is a valid beta
		 * product and the`theme` matches the `productSlug`
		 *
		 * Once all products are 'onboarded' we can remove this filtering layer
		 * for the beta products.
		 *
		 * @TODO once we implement the `theme` query option, remove the theme filtering
		 * https://app.asana.com/0/1201903760348480/1201932088801131/f
		 */
		const isCloud = productSlugFromCollection == 'cloud'
		const normalizedProductSlug = normalizeSlugForDevDot(
			productSlugFromCollection
		)
		const themeMatches = productSlugFromCollection === collection.theme
		const shouldBuildTutorialPath = isCloud || themeMatches

		if (shouldBuildTutorialPath) {
			// go through the tutorials within the collection, create a path for each
			collection.tutorials.forEach((tutorial: ClientTutorialLite) => {
				const tutorialSlug = splitProductFromFilename(tutorial.slug)

				paths.push({
					params: {
						productSlug: normalizedProductSlug,
						tutorialSlug: [collectionSlug, tutorialSlug] as [string, string],
					},
				})
				// If the Tutorial has variants, push a path for each one
				if (tutorial.variant) {
					tutorial.variant.options.forEach(
						(variantOption: TutorialVariantOption) => {
							const variantParam = getVariantParam(
								tutorial.variant.slug,
								variantOption.slug
							)
							paths.push({
								params: {
									productSlug: normalizedProductSlug,
									tutorialSlug: [
										collectionSlug,
										tutorialSlug,
										variantParam,
									] as [string, string, string],
								},
							})
						}
					)
				}
			})
		}
	})
	return paths
}
