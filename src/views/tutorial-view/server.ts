import moize, { Options } from 'moize'
import { LearnProductData, LearnProductSlug } from 'types/products'

import {
	getAllCollections,
	getNextCollectionInSidebar,
} from 'lib/learn-client/api/collection'
import { getTutorial } from 'lib/learn-client/api/tutorial'
import {
	CollectionLite as ClientCollectionLite,
	Collection as ClientCollection,
	ProductOption,
	TutorialLite as ClientTutorialLite,
} from 'lib/learn-client/types'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import getIsBetaProduct from 'lib/get-is-beta-product'
import { splitProductFromFilename } from './utils'
import { serializeContent } from './utils/serialize-content'
import { TutorialSidebarSidecarProps, TutorialData } from '.'
import {
	getCollectionContext,
	getCurrentCollectionTutorial,
} from './utils/get-collection-context'
import { getTutorialsBreadcrumb } from './utils/get-tutorials-breadcrumb'
import { getCollectionViewSidebarSections } from 'views/collection-view/server'

export interface TutorialPageProps {
	tutorial: TutorialData
	product: LearnProductData
	layoutProps: TutorialSidebarSidecarProps
	nextCollection?: ClientCollectionLite | null // if null, it is the last collection in the sidebar order
}

/**
 * Given a ProductData object (imported from src/data JSON files) and a tutorial
 * slug, fetches and returns the page props for
 * `/{productSlug}/tutorials/{collectionSlug}/{tutorialSlug}` pages.
 *
 * Returns the given ProductData object unmodified as the `product` page prop,
 * which is needed for other areas of the app to function.
 */
export async function getTutorialPageProps(
	product: LearnProductData,
	slug: [string, string]
): Promise<{ props: TutorialPageProps } | null> {
	const { collection, tutorialReference } = await getCurrentCollectionTutorial(
		product.slug as ProductOption,
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
		product,
		collection.data
	)
	const layoutProps = {
		headings,
		breadcrumbLinks: getTutorialsBreadcrumb({
			product: { name: product.name, filename: product.slug },
			collection: {
				name: collection.data.shortName,
				filename: collection.filename,
			},
			tutorial: {
				name: fullTutorialData.name,
				filename: tutorialReference.filename,
			},
		}),
		sidebarSections,
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
		props: stripUndefinedProperties({
			metadata: {
				title: fullTutorialData.name,
				description: fullTutorialData.description,
			},
			tutorial: {
				...fullTutorialData,
				content: serializedContent,
				collectionCtx: collectionContext,
				headings,
				nextCollectionInSidebar: nextCollection,
			},
			product,
			layoutProps,
			nextCollection,
		}),
	}
}

export interface TutorialPagePaths {
	params: {
		tutorialSlug: [string, string]
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
		if (
			getIsBetaProduct(productSlugFromCollection as LearnProductSlug) &&
			productSlugFromCollection === collection.theme
		) {
			collection.tutorials.map((tutorial: ClientTutorialLite) => {
				const tutorialSlug = splitProductFromFilename(tutorial.slug)

				paths.push({
					params: {
						productSlug: productSlugFromCollection,
						tutorialSlug: [collectionSlug, tutorialSlug] as [string, string],
					},
				})
			})
		}
	})

	return paths
}
