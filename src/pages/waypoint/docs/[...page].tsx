import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
} from 'next'
import waypointData from 'data/waypoint.json'
import { ProductData } from 'types/products'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import DocsView from 'views/docs-view'

const basePath = 'docs'
const baseName = 'Docs'
const product = waypointData as ProductData

const {
  getStaticPaths: generatedGetStaticPaths,
  getStaticProps: generatedGetStaticProps,
} = getStaticGenerationFunctions({
  product,
  basePath,
  baseName,
})

/**
 * Wrapper for `generatedGetStaticProps` that first checks if the current page
 * is `/waypoint/docs/index`. If that is the current page, then the user will be
 * sent to the 404 page. Otherwise, `generatedGetStaticProps` will be invoked as
 * usual.
 */
export async function getStaticProps(context: GetStaticPropsContext) {
  if (context.params.page[0] === 'index') {
    return {
      notFound: true,
    }
  }

  return await generatedGetStaticProps(context)
}

/**
 * Wrapper for `generatedGetStaticPaths`. It handles removing the index path
 * from the `paths` array returned by `generatedGetStaticPaths`.
 */
export async function getStaticPaths(
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

export default DocsView
