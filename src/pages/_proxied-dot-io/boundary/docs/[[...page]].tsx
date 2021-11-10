import BoundaryIoLayout from 'layouts/_proxied-dot-io/boundary'
import DocsPage from '@hashicorp/react-docs-page'
import { GetStaticPathsResult } from 'next'
import { getStaticGenerationFunctions } from '@hashicorp/react-docs-page/server'
import productConfig from 'data/boundary.json'

const product = { name: productConfig.name, slug: productConfig.slug }
const basePath = 'docs'
const navDataFile = `../data/${basePath}-nav-data.json`
const localContentDir = `content/${basePath}`
const isContentDeployPreview =
  process.env.DEV_IO_PROXY == 'boundary' &&
  process.env.IS_CONTENT_DEPLOY_PREVIEW
const enableVersionedDocs =
  typeof process.env.ENABLE_VERSIONED_DOCS !== 'undefined' &&
  process.env.ENABLE_VERSIONED_DOCS === 'true'
const additionalComponents = {}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function DocsView(props) {
  return (
    <DocsPage
      product={product}
      baseRoute={basePath}
      staticProps={props}
      showVersionSelect={enableVersionedDocs && !isContentDeployPreview}
      additionalComponents={additionalComponents}
    />
  )
}

const remoteOpts = {
  strategy: 'remote' as const,
  fallback: 'blocking' as GetStaticPathsResult['fallback'],
  revalidate: 10,
  basePath,
}
const localOpts = {
  strategy: 'fs' as const,
  navDataFile,
  localContentDir,
}
const staticFunctions = getStaticGenerationFunctions({
  ...(isContentDeployPreview ? localOpts : remoteOpts),
  product: productConfig.slug,
})

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getStaticPaths(ctx) {
  return staticFunctions.getStaticPaths(ctx)
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getStaticProps(ctx) {
  return staticFunctions.getStaticProps(ctx)
}

DocsView.layout = BoundaryIoLayout
export default DocsView
