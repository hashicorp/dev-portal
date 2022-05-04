import waypointData from 'data/waypoint.json'
import { ProductData } from 'types/products'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import DocsView from 'views/docs-view'
import { GetStaticPathsContext, GetStaticPathsResult } from 'next'

const basePath = 'docs'
const baseName = 'Docs'
const product = waypointData as ProductData

const { getStaticPaths: generatedGetStaticPaths, getStaticProps } =
  getStaticGenerationFunctions({
    product,
    basePath,
    baseName,
  })

/**
 * Note that we need to exclude the usually-included `/` empty path,
 * as otherwise, we'll have conflicting paths with our `/docs/index.tsx` file.
 * (and NextJS will get mad since this is not an "optional catch-all" route).
 */
export async function getStaticPaths(
  context: GetStaticPathsContext
): Promise<GetStaticPathsResult> {
  const { paths, ...restReturn } = await generatedGetStaticPaths(context)
  const pathsWithoutIndex = paths.filter((pathEntry) => {
    const isIndexPath =
      typeof pathEntry == 'string'
        ? pathEntry == ''
        : pathEntry.params.page.length == 0
    return !isIndexPath
  })
  return { ...restReturn, paths: pathsWithoutIndex }
}

export { getStaticProps }
export default DocsView
