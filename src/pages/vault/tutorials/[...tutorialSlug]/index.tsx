import { GetStaticPathsResult, GetStaticPropsResult } from 'next'
import vaultData from 'data/vault.json'
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

export function VaultTutorialPage({
  tutorial,
  layoutProps,
}: TutorialPageProps): React.ReactElement {
  return <TutorialView tutorial={tutorial} layout={layoutProps} />
}

export async function getStaticProps({
  params,
}): Promise<GetStaticPropsResult<TutorialPageProps>> {
  const product = vaultData as LearnProductData
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

VaultTutorialPage.layout = CoreDevDotLayout
export default VaultTutorialPage
