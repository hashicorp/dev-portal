import { ProductOption } from 'lib/learn-client/types'
import TutorialView from 'views/tutorial-view'
import {
  getTutorialPagePaths,
  getTutorialPageProps,
  TutorialPageProps,
  TutorialPagePaths,
} from 'views/tutorial-view/server'

export default function TutorialPage({
  tutorial,
}: TutorialPageProps): React.ReactElement {
  return <TutorialView {...tutorial} />
}

export async function getStaticProps({
  params,
}): Promise<{ props: TutorialPageProps }> {
  const props = await getTutorialPageProps(
    ProductOption['waypoint'],
    params.tutorialSlug
  )
  return props
}

export async function getStaticPaths(): Promise<{
  paths: TutorialPagePaths[]
  fallback: boolean
}> {
  const paths = await getTutorialPagePaths(ProductOption['waypoint'])
  return { paths, fallback: false }
}
