import moize, { Options } from 'moize'

import {
	Collection as ClientCollection,
	ProductOption,
} from 'lib/learn-client/types'
import {
	LearnProductData,
	LearnProductName,
	LearnProductSlug,
} from 'types/products'
import {
	getAllCollections,
	getCollection,
	getCollectionsBySection,
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
	productSlug: LearnProductSlug | 'hcp',
	collection: ClientCollection
) {
	let filteredCollections

	// TODO: not sure if branching here makes the best sense,
	// or if a separate getHcpCollectionViewSidebarSections might be better
	if (productSlug == 'hcp') {
		filteredCollections = await getCollectionsBySection('cloud')
	} else {
		const allProductCollections = await cachedGetAllCollections({
			product: { slug: productSlug as ProductOption, sidebarSort: true },
		})
		filteredCollections = filterCollections(
			allProductCollections,
			productSlug as ProductOption
		)
	}

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
	product: {
		name: LearnProductName
		slug: LearnProductSlug | 'hcp'
	},
	slug: string
): Promise<{ props: CollectionPageProps } | null> {
	const learnProductSlug = product.slug == 'hcp' ? 'cloud' : product.slug
	const collection = await getCollection(`${learnProductSlug}/${slug}`)

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
			product.slug,
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
		 */
		const compatSlug = productSlug === 'cloud' ? 'hcp' : productSlug
		const isBetaProduct = getIsBetaProduct(compatSlug as LearnProductSlug)
		/**
		 * TODO: not actually sure this is correct, just trying to get cloud
		 * collections to render
		 */
		const hasMatchingTheme =
			productSlug == 'cloud' || productSlug === collection.theme
		const shouldBuildCollectionPath = isBetaProduct && hasMatchingTheme

		if (productSlug == 'cloud') {
			console.log({
				shouldBuildCollectionPath,
				collectionSlug: filename,
				isBetaProduct,
				hasMatchingTheme,
				theme: collection.theme,
			})
			console.log({
				params: {
					productSlug: compatSlug,
					collectionSlug: filename,
				},
			})
		}

		if (shouldBuildCollectionPath) {
			paths.push({
				params: {
					productSlug: compatSlug,
					collectionSlug: filename,
				},
			})
		}
	})

	return paths
}
