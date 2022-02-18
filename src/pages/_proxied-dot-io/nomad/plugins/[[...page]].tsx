import NomadIoLayout from 'layouts/_proxied-dot-io/nomad'
import DocsPage from '@hashicorp/react-docs-page'
import productData from 'data/nomad.json'
import { isVersionedDocsEnabled } from 'lib/env-checks'
// Imports below are used in getStatic functions only
import { getStaticGenerationFunctions } from 'lib/_proxied-dot-io/get-static-generation-functions'

const product = { name: productData.name, slug: productData.slug }
const basePath = 'plugins'
const navDataFile = `../data/${basePath}-nav-data.json`
const localContentDir = `../content/${basePath}`
const localPartialsDir = `../content/partials`
const enableVersionedDocs = isVersionedDocsEnabled(productData.slug)
const additionalComponents = {}

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

const staticGenFns = getStaticGenerationFunctions(
  enableVersionedDocs
    ? {
        strategy: 'remote',
        basePath,
        fallback: 'blocking',
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

// Export getStatic functions
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function getStaticPaths(ctx) {
  // TODO: content is not yet extracted, because
  // TODO: this docs path does not exist on stable-website,
  // TODO: only on main (unreleased).
  // TODO: need to consider what approach we'll take
  // TODO: during migration if website code on main
  // TODO: is significantly different (slash breaks)
  // TODO: compared to website code on stable-website.
  if (enableVersionedDocs) return { paths: [], fallback: 'blocking' }
  return staticGenFns.getStaticPaths(ctx)
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function getStaticProps(ctx) {
  return staticGenFns.getStaticProps(ctx)
}
// Export view with layout
DocsView.layout = NomadIoLayout
export default DocsView
