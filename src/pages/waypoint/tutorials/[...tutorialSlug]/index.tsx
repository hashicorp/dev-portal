import { GetStaticPathsResult, GetStaticPropsResult } from 'next'
import waypointData from 'data/waypoint.json'
import { LearnProductData } from 'types/products'
import { ProductOption } from 'lib/learn-client/types'
import TutorialView from 'views/tutorial-view'
import {
  getTutorialPagePaths,
  getTutorialPageProps,
  TutorialPageProps,
  TutorialPagePaths,
} from 'views/tutorial-view/server'
import CoreDevDotLayout from 'layouts/core-dev-dot-layout'

export function WaypointTutorialPage({
  layoutProps,
  product,
  tutorial,
}: TutorialPageProps): React.ReactElement {
  return (
    <TutorialView layout={layoutProps} product={product} tutorial={tutorial} />
  )
}

export async function getStaticProps({
  params,
}): Promise<GetStaticPropsResult<TutorialPageProps>> {
  const product = waypointData as LearnProductData
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
  const paths = await getTutorialPagePaths(ProductOption['waypoint'])
  return {
    paths,
    fallback: 'blocking',
  }
}

WaypointTutorialPage.layout = CoreDevDotLayout
export default WaypointTutorialPage
