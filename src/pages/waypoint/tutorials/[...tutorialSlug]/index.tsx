import { GetStaticPathsResult } from 'next'
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
  tutorial,
  layoutProps,
}: TutorialPageProps): React.ReactElement {
  return <TutorialView tutorial={tutorial} layout={layoutProps} />
}

export async function getStaticProps({
  params,
}): Promise<{ props: TutorialPageProps }> {
  const product = waypointData as LearnProductData

  return await getTutorialPageProps(product, params.tutorialSlug)
}

export async function getStaticPaths(): Promise<
  GetStaticPathsResult<TutorialPagePaths['params']>
> {
  const paths = await getTutorialPagePaths(ProductOption['waypoint'])
  return {
    paths: paths.slice(0, __config.learn.max_static_paths ?? 0),
    fallback: 'blocking',
  }
}

WaypointTutorialPage.layout = CoreDevDotLayout
export default WaypointTutorialPage
