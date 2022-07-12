import { GetStaticPathsContext, GetStaticPathsResult } from 'next'
import vaultData from 'data/vault.json'
import { ProductData } from 'types/products'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import DocsView from 'views/docs-view'
import { vaultUrlAdjuster } from 'layouts/sidebar-sidecar/utils/product-url-adjusters'

const basePath = 'docs'
const baseName = 'Docs'
const product = vaultData as ProductData

const { getStaticPaths: generatedGetStaticPaths, getStaticProps } =
  getStaticGenerationFunctions({
    product,
    basePath,
    baseName,
    additionalRemarkPlugins: [vaultUrlAdjuster],
  })

/**
 * Wrapper for `generatedGetStaticPaths`. It handles removing the index path
 * from the `paths` array returned by `generatedGetStaticPaths`.
 */
async function getStaticPaths(
  context: GetStaticPathsContext
): Promise<GetStaticPathsResult> {
  const { paths, ...restReturn } = await generatedGetStaticPaths(context)
  // eslint-disable-next-line @typescript-eslint/typedef
  const pathsWithoutIndex = paths.filter((pathEntry) => {
    const isIndexPath =
      typeof pathEntry == 'string'
        ? pathEntry == ''
        : pathEntry.params.page.length == 0
    return !isIndexPath
  })
  return { ...restReturn, paths: pathsWithoutIndex }
}

export { getStaticPaths, getStaticProps }
export default DocsView
