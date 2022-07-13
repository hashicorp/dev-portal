import moize, { Options } from 'moize'
import { GetStaticPathsResult } from 'next'

import { getAllCollections } from 'lib/learn-client/api/collection'

import { ProductSlug } from 'types/products'
import CollectionView from 'views/collection-view'
import {
	generateStaticFunctions,
	CollectionPagePath,
} from 'views/collection-view/server'

import getIsBetaProduct from 'lib/get-is-beta-product'

const { getStaticProps } = generateStaticFunctions()

const moizeOpts: Options = {
	isPromise: true,
	maxSize: Infinity,
	isDeepEqual: true,
}

const cachedGetAllCollections = moize(getAllCollections, moizeOpts)

async function getCollectionPagePaths(): Promise<CollectionPagePath[]> {
	const collections = await cachedGetAllCollections()
	// @TODO only build collections that are in beta
	const filteredCollections = collections.filter((c) =>
		getIsBetaProduct(c.theme as ProductSlug)
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

async function getStaticPaths(): Promise<
	GetStaticPathsResult<CollectionPagePath['params']>
> {
	const paths = await getCollectionPagePaths()

	return {
		paths,
		fallback: false,
	}
}

export { getStaticPaths, getStaticProps }

// get static paths would just get every collection and render it / filtering out onboarding and waf

export default CollectionView
