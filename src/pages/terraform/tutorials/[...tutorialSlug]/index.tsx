import { GetStaticPathsResult, GetStaticPropsResult } from 'next'
import terraformData from 'data/terraform.json'
import { LearnProductData } from 'types/products'
import { ProductOption } from 'lib/learn-client/types'
import TutorialView from 'views/tutorial-view'
import {
	getTutorialPagePaths,
	getTutorialPageProps,
	TutorialPageProps,
	TutorialPagePaths,
} from 'views/tutorial-view/server'

export function TerraformTutorialPage({
	layoutProps,
	tutorial,
	product,
}: TutorialPageProps): React.ReactElement {
	return (
		<TutorialView layout={layoutProps} tutorial={tutorial} product={product} />
	)
}

export async function getStaticProps({
	params,
}): Promise<GetStaticPropsResult<TutorialPageProps>> {
	const product = terraformData as LearnProductData
	const props = await getTutorialPageProps(product, params.tutorialSlug)

	// If the tutorial doesn't exist, hit the 404
	if (!props) {
		return { notFound: true }
	}

	return props
}

export async function getStaticPaths(): Promise<
	GetStaticPathsResult<TutorialPagePaths['params']>
> {
	const paths = await getTutorialPagePaths(ProductOption['vault'])

	return {
		paths: paths.slice(0, __config.learn.max_static_paths ?? 0),
		fallback: 'blocking',
	}
}

export default TerraformTutorialPage
