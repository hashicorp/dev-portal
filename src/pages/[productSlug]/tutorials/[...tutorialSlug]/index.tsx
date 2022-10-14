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

	const paths = (
		await Promise.all(
			activeProductSlugs.map(async (productSlug) => {
				// fetch paths from analytics for each product
				const analyticsPaths = await getStaticPathsFromAnalytics({
					param: 'tutorialSlug',
					limit: __config.learn.max_static_paths ?? 0,
					pathPrefix: `/${productSlug}/tutorials`,
					validPaths,
				})

				// add the productSlug param to the resulting params object
				return analyticsPaths.map((result) => {
					// @ts-expect-error - this is okay
					result.params.productSlug = productSlug

					return result
				})
			})
		)
	).flat()

	return {
		// @ts-expect-error - TODO need to refine the types here
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
