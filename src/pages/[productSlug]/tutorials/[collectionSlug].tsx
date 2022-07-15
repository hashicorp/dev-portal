import {
	GetStaticPropsResult,
	GetStaticPathsResult,
	GetStaticPropsContext,
} from 'next'
import { LearnProductSlug } from 'types/products'
import { cachedGetProductData } from 'lib/get-product-data'
import CollectionView from 'views/collection-view'
import {
	CollectionPagePath,
	CollectionPageProps,
	getCollectionPagePaths,
	getCollectionPageProps,
} from 'views/collection-view/server'

async function getStaticPaths(): Promise<
	GetStaticPathsResult<CollectionPagePath['params']>
> {
	const paths = await getCollectionPagePaths()

	return {
		paths,
		fallback: false,
	}
}

async function getStaticProps({
	params,
}: GetStaticPropsContext<{
	productSlug: LearnProductSlug
	collectionSlug: string
}>): Promise<GetStaticPropsResult<CollectionPageProps>> {
	const { collectionSlug, productSlug } = params
	const productData = cachedGetProductData(productSlug)

	const props = await getCollectionPageProps(productData, collectionSlug)
	// If the collection doesn't exist, hit the 404
	if (!props) {
		return { notFound: true }
	}
	return props
}

export { getStaticPaths, getStaticProps }
export default CollectionView
