import { GetStaticPathsResult } from 'next'
import vaultData from 'data/vault.json'
import { ProductOption } from 'lib/learn-client/types'
import TutorialView from 'views/tutorial-view'
import {
  getTutorialPagePaths,
  getTutorialPageProps,
  TutorialPageProps,
  TutorialPagePaths,
  TutorialPageProduct,
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
}): Promise<{ props: TutorialPageProps }> {
  const product = {
    slug: vaultData.slug,
    name: vaultData.name,
  } as TutorialPageProduct
  const props = await getTutorialPageProps(product, params.tutorialSlug)
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
