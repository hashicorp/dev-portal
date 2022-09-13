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
import { normalizeSlugForTutorials } from 'lib/tutorials/normalize-product-like-slug'
import { isProductSlug } from 'lib/products'
import { SidebarSidecarLayoutProps } from 'layouts/sidebar-sidecar'
import { getTutorialsBreadcrumb } from 'views/tutorial-view/utils/get-tutorials-breadcrumb'
import {
	CollectionCategorySidebarSection,
	formatSidebarCategorySections,
	buildCategorizedHcpSidebar,
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
	let sidebarSections

	/**
	 * Note that `hcp` is a "product" in Dev Dot but not in Learn,
	 * so we do some branching.
	 */
	if (productSlug == 'hcp') {
		const allHcpCollections = await getCollectionsBySection('cloud')
		sidebarSections = buildCategorizedHcpSidebar(
			allHcpCollections,
			collection.slug
		)
	} else {
		const allProductCollections = await cachedGetAllCollections({
			product: { slug: productSlug as ProductOption, sidebarSort: true },
		})
		const filteredCollections = filterCollections(
			allProductCollections,
			productSlug as ProductOption
		)

		sidebarSections = formatSidebarCategorySections(
			filteredCollections,
			collection.slug
		)
	}
	return sidebarSections
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
	// product.slug may be "hcp", needs to be "cloud" for Learn API use
	const learnProductSlug = normalizeSlugForTutorials(product.slug)
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
		const [collectionProductSlug, filename] = collection.slug.split('/')

		const productSlug =
			collectionProductSlug === 'cloud' ? 'hcp' : collectionProductSlug
		/**
		 * Only build collections where the `productSlug` is a valid beta product.
		 * As well, for all non-HCP products, only build collections where
		 * `theme` matches the `productSlug`.
		 *
		 * Once all products are 'onboarded' we can remove this filtering layer
		 * for the beta products.
		 *
		 * @TODO once we implement the `theme` query option, remove the theme filtering
		 * https://app.asana.com/0/1201903760348480/1201932088801131/f
		 */
		const isBetaProduct =
			isProductSlug(productSlug) && getIsBetaProduct(productSlug)
		const isCloud = collectionProductSlug == 'cloud'
		const themeMatches = collectionProductSlug === collection.theme
		const shouldBuildCollectionPath = isBetaProduct && (isCloud || themeMatches)

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
