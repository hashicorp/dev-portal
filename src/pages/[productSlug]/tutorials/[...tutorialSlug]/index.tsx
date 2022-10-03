import {
	GetStaticPropsResult,
	GetStaticPathsResult,
	GetStaticPropsContext,
} from 'next'
import { LearnProductData, LearnProductSlug } from 'types/products'
import { cachedGetProductData } from 'lib/get-product-data'
import TutorialView from 'views/tutorial-view'
import {
	TutorialPageProps,
	TutorialPagePaths,
	getTutorialPagePaths,
	getTutorialPageProps,
} from 'views/tutorial-view/server'

async function getStaticPaths(): Promise<
	GetStaticPathsResult<TutorialPagePaths['params']>
> {
	const paths = await getTutorialPagePaths()
	return {
		paths: paths.slice(0, __config.learn.max_static_paths ?? 0),
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
