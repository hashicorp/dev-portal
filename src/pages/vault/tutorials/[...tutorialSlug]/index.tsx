import { GetStaticPathsResult } from 'next'
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
  return <TutorialView {...tutorial} layout={layoutProps} />
}

export async function getStaticProps({
  params,
}): Promise<{ props: TutorialPageProps }> {
  const props = await getTutorialPageProps(
    ProductOption['vault'],
    params.tutorialSlug
  )
  return props
}

export async function getStaticPaths(): Promise<
  GetStaticPathsResult<TutorialPagePaths['params']>
> {
  const pagePaths = await getTutorialPagePaths(ProductOption['vault'])
  return pagePaths
}

WaypointTutorialPage.layout = CoreDevDotLayout
export default WaypointTutorialPage
