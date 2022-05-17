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

export async function getStaticProps(context: GetStaticPropsContext) {
  // Make sure this doesn't catch /waypoint/docs/index route
  if (context.params.page[0] === 'index') {
    return {
      notFound: true,
    }
  }

  return await generatedGetStaticProps(context)
}

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
