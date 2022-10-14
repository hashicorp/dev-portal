import {
	GetStaticPropsResult,
	GetStaticPathsResult,
	GetStaticPropsContext,
} from 'next'
import { LearnProductData, LearnProductSlug } from 'types/products'
import { cachedGetProductData } from 'lib/get-product-data'
import { getStaticPathsFromAnalytics } from 'lib/get-static-paths-from-analytics'
import TutorialView from 'views/tutorial-view'
import {
	TutorialPageProps,
	TutorialPagePaths,
	getTutorialPagePaths,
	getTutorialPageProps,
} from 'views/tutorial-view/server'
import { activeProductSlugs } from 'lib/products'

async function getStaticPaths(): Promise<
	GetStaticPathsResult<TutorialPagePaths['params']>
> {
	const validPaths = await getTutorialPagePaths()

	let paths = []

	try {
		paths = (
			await Promise.all(
				activeProductSlugs.map(async (productSlug) => {
					// fetch paths from analytics for each product
					const analyticsPaths = await getStaticPathsFromAnalytics<
						TutorialPagePaths['params']
					>({
						param: 'tutorialSlug',
						limit: __config.learn.max_static_paths ?? 0,
						pathPrefix: `/${productSlug}/tutorials`,
						validPaths,
					})

					// add the productSlug param to the resulting params object
					return analyticsPaths.map((result) => {
						result.params.productSlug = productSlug

						return result
					})
				})
			)
		).flat()
	} catch {
		// In the case of an error, fallback to using the base list of generated paths to ensure we do _some_ form of static generation
		paths = validPaths.slice(0, __config.learn.max_static_paths ?? 0)
	}

	return {
		paths,
		fallback: 'blocking',
	}
}
type TutorialPageStaticPropsCtx = GetStaticPropsContext<{
	productSlug: LearnProductSlug
	tutorialSlug: [string, string]
}>

async function getStaticProps({
	params,
}: TutorialPageStaticPropsCtx): Promise<
	GetStaticPropsResult<TutorialPageProps>
> {
	const { productSlug, tutorialSlug } = params

	const productData = cachedGetProductData(productSlug) as LearnProductData
	const props = await getTutorialPageProps(productData, tutorialSlug)
	// If the tutorial doesn't exist, hit the 404
	if (!props) {
		return { notFound: true }
	}
	return props
}

export { getStaticPaths, getStaticProps }
export default TutorialView
