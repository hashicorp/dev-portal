import { GetStaticPathsResult } from 'next'
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
import moize, { Options } from 'moize'

export function VaultTutorialPage({
  tutorial,
  layoutProps,
}: TutorialPageProps): React.ReactElement {
  return <TutorialView tutorial={tutorial} layout={layoutProps} />
}

const moizeOpts: Options = { maxSize: Infinity }
const cachedTestFunction = moize(() => {
  console.log('TESTS FUNCTION')
  return 'hello'
}, moizeOpts)

export async function getStaticProps({
  params,
}): Promise<{ props: TutorialPageProps }> {
  const product = vaultData as LearnProductData
  return getTutorialPageProps(product, params.tutorialSlug)
}

export async function getStaticPaths(): Promise<
  GetStaticPathsResult<TutorialPagePaths['params']>
> {
  const paths = await getTutorialPagePaths(ProductOption['vault'])
  const thingie = cachedTestFunction()
  return {
    paths: paths.slice(0, __config.learn.max_static_paths ?? 0),
    fallback: 'blocking',
  }
}

VaultTutorialPage.layout = CoreDevDotLayout
export default VaultTutorialPage
