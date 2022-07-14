import moize, { Options } from 'moize'
import {
	GetStaticPropsResult,
	GetStaticPathsResult,
	GetStaticPropsContext,
} from 'next'
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

async function getCollectionPagePaths(): Promise<CollectionPagePath[]> {
	const collections = await cachedGetAllCollections()

	// @TODO only build collections that are in beta
	const filteredCollections = collections.filter((c) =>
		getIsBetaProduct(c.theme as LearnProductSlug)
	)
	const paths = filteredCollections.map((collection) => {
		// assuming slug structure of :product/:filename
		const [product, filename] = collection.slug.split('/')
		return {
			params: {
				product,
				collectionSlug: filename,
			},
		}
	})

	return paths
}

/**
 * For all beta products,
 * Return { getStaticPaths, getStaticProps } functions
 * needed to set up a [collectionSlug] route.
 */
export function generateStaticFunctions() {
	// getStaticPaths
	async function getStaticPaths(): Promise<
		GetStaticPathsResult<CollectionPagePath['params']>
	> {
		const paths = await getCollectionPagePaths()

		return {
			paths,
			fallback: false,
		}
	}
	// getStaticProps
	async function getStaticProps({
		params,
	}: GetStaticPropsContext<{
		product: LearnProductSlug
		collectionSlug: string
	}>): Promise<GetStaticPropsResult<CollectionPageProps>> {
		const { collectionSlug, product } = params
		const productData = await import(`data/${product}.json`) // @TODO use fs.readFileSync here?

		const props = await getCollectionPageProps(productData, collectionSlug)
		// If the collection doesn't exist, hit the 404
		if (!props) {
			return { notFound: true }
		}
		return props
	}
	// return both
	return { getStaticProps, getStaticPaths }
}
