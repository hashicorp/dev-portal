import moize, { Options } from 'moize'

import { LearnProductData } from 'types/products'
import { Collection as ClientCollection } from 'lib/learn-client/types'
import { LearnProductSlug } from 'types/products'
import {
	getAllCollections,
	getCollection,
} from 'lib/learn-client/api/collection'
import { splitProductFromFilename } from 'views/tutorial-view/utils'
import getIsBetaProduct from 'lib/get-is-beta-product'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { SidebarSidecarLayoutProps } from 'layouts/sidebar-sidecar'
import { getTutorialsBreadcrumb } from 'views/tutorial-view/utils/get-tutorials-breadcrumb'

import {
	CollectionCategorySidebarSection,
	formatSidebarCategorySections,
} from './helpers'
import { filterCollections } from '../product-tutorials-view/helpers'

export interface CollectionPageProps {
	collection: ClientCollection
	allProductCollections: ClientCollection[]
	product: LearnProductData
	layoutProps: CollectionLayout
}

export type CollectionLayout = Pick<
	SidebarSidecarLayoutProps,
	'breadcrumbLinks'
> & { sidebarSections: CollectionCategorySidebarSection[] }

export interface CollectionPagePath {
	params: {
		collectionSlug: string
	}
}

const moizeOpts: Options = {
	isPromise: true,
	maxSize: Infinity,
	isDeepEqual: true,
}
// limit the expensive call for collections who all have the same product
const cachedGetAllCollections = moize(getAllCollections, moizeOpts)

export async function getCollectionViewSidebarSections(
	product: LearnProductData,
	collection: ClientCollection
) {
	const allProductCollections = await cachedGetAllCollections({
		product: { slug: product.slug, sidebarSort: true },
	})
	const filteredCollections = filterCollections(
		allProductCollections,
		product.slug
	)

	return formatSidebarCategorySections(filteredCollections, collection.slug)
}

/**
 * Given a ProductData object (imported from src/data JSON files) and a
 * Collection slug, fetches and returns the page props for
 * `/{productSlug}/tutorials/{collectionSlug}` pages.
 *
 * Returns the given ProductData object unmodified as the `product` page prop,
 * which is needed for other areas of the app to function.
 */
export async function getCollectionPageProps(
	product: LearnProductData,
	slug: string
): Promise<{ props: CollectionPageProps } | null> {
	const collection = await getCollection(`${product.slug}/${slug}`)

	// if null the api encountered a 404
	if (collection === null) {
		return null
	}

	const layoutProps = {
		breadcrumbLinks: getTutorialsBreadcrumb({
			product: { name: product.name, filename: product.slug },
			collection: {
				name: collection.shortName,
				filename: splitProductFromFilename(collection.slug),
			},
		}),
		sidebarSections: await getCollectionViewSidebarSections(
			product,
			collection
		),
	}

	return {
		props: stripUndefinedProperties({
			metadata: {
				title: collection.shortName,
				description: collection.description,
			},
			collection: collection,
			product,
			layoutProps,
		}),
	}
}

/**
 * These paths are built with the collection slug as context for truth.
 * We build the path using the collection's product association for the proper slug context.
 * Original Collection Slug — :productSlug/:collectionFilename
 * Final route — :productSlug/tutorials/:collectionFilename
 */

export async function getCollectionPagePaths(): Promise<CollectionPagePath[]> {
	const collections = await cachedGetAllCollections()
	const paths = []
	collections.forEach((collection: ClientCollection) => {
		// assuming slug structure of :product/:filename
		const [productSlug, filename] = collection.slug.split('/')
		/**
		 * Only build collections where the `productSlug` is a valid beta
		 * product and the`theme` matches the `productSlug`
		 *
		 * Once all products are 'onboarded' we can remove this filtering layer
		 * for the beta products.
		 *
		 * @TODO once we implement the `theme` query option, remove the theme filtering
		 * https://app.asana.com/0/1201903760348480/1201932088801131/f
		 *
		 * @TODO ignoring `hcp` product slug for now until we know whether or not
		 * we're using "hcp" or "cloud".
		 * https://app.asana.com/0/1202097197789424/1202618936981037/f
		 */
		const shouldBuildCollectionPath =
			productSlug !== 'hcp' &&
			getIsBetaProduct(productSlug as LearnProductSlug) &&
			productSlug === collection.theme

		if (shouldBuildCollectionPath) {
			paths.push({
				params: {
					productSlug,
					collectionSlug: filename,
				},
			})
		}
	})

	return paths
}
