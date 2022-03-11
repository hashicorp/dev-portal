import { ProductOption } from 'lib/learn-client/types'
import TutorialView from 'views/tutorial-view'
import {
  getTutorialPagePaths,
  getTutorialPageProps,
  TutorialPageProps,
  TutorialPagePaths,
  TutorialPageProduct,
} from 'views/tutorial-view/server'
import { name, slug } from 'data/waypoint.json'

export default function WaypointTutorialPage({
  tutorial,
}: TutorialPageProps): React.ReactElement {
  return <TutorialView {...tutorial} />
}

export async function getStaticProps({
  params,
}): Promise<{ props: TutorialPageProps }> {
  const product = {
    slug,
    name,
  } as TutorialPageProduct
  const props = await getTutorialPageProps(product, params.tutorialSlug)
  return props
}

export async function getStaticPaths(): Promise<{
  paths: TutorialPagePaths[]
  fallback: boolean
}> {
  const paths = await getTutorialPagePaths(ProductOption['waypoint'])
  return { paths, fallback: false }
}
