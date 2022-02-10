import WaypointIoLayout from 'layouts/_proxied-dot-io/waypoint'
import Placement from 'components/_proxied-dot-io/waypoint/placement-table'
import NestedNode from 'components/_proxied-dot-io/waypoint/nested-node'
import DocsPage from '@hashicorp/react-docs-page'
import productData from 'data/waypoint.json'
import { isVersionedDocsEnabled } from 'lib/env-checks'
// Imports below are used in getStatic functions only
import { getStaticGenerationFunctions } from '@hashicorp/react-docs-page/server'

const product = { name: productData.name, slug: productData.slug }
const basePath = 'docs'
const navDataFile = `../data/${basePath}-nav-data.json`
const localContentDir = `../content/${basePath}`
const localPartialsDir = `../content/partials`
const enableVersionedDocs = isVersionedDocsEnabled(productData.slug)
const additionalComponents = { Placement, NestedNode }

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function DocsView(props) {
  return (
    <DocsPage
      product={product}
      baseRoute={basePath}
      staticProps={props}
      additionalComponents={additionalComponents}
      showVersionSelect={enableVersionedDocs}
      algoliaConfig={productData.algoliaConfig}
    />
  )
}

const {
  getStaticPaths: getStaticPathsBase,
  getStaticProps,
} = getStaticGenerationFunctions(
  enableVersionedDocs
    ? {
        strategy: 'remote',
        basePath,
        fallback: 'blocking',
        revalidate: 360, // 1 hour
        product: productData.slug,
      }
    : {
        strategy: 'fs',
        localContentDir,
        navDataFile,
        localPartialsDir,
        product: productData.slug,
      }
)

const getStaticPaths = async (ctx) => {
  const result = await getStaticPathsBase(ctx)

  return {
    ...result,
    paths: result.paths.slice(
      0,
      Number.parseInt(process.env.IO_SITES_MAX_STATIC_PATHS, 10)
    ),
  }
}

// Export getStatic functions
export { getStaticPaths, getStaticProps }
// Export view with layout
DocsView.layout = WaypointIoLayout
export default DocsView
