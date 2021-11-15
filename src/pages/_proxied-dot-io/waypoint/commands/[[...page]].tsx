import WaypointIoLayout from 'layouts/_proxied-dot-io/waypoint'
import DocsPage from '@hashicorp/react-docs-page'
import { GetStaticPathsResult } from 'next'
import { getStaticGenerationFunctions } from '@hashicorp/react-docs-page/server'
import productConfig from 'data/waypoint.json'

const product = { name: productConfig.name, slug: productConfig.slug }
const basePath = 'commands'
const navDataFile = `../data/${basePath}-nav-data.json`
const localContentDir = `content/${basePath}`
// TODO: still experimenting with deploy preview approach
// isContentDeployPreview is a first attempt at building deploy
// previews in content repo contexts by cloning and building
// the dev-portal repository
const isContentDeployPreview =
  process.env.DEV_IO_PROXY == 'boundary' &&
  process.env.IS_CONTENT_DEPLOY_PREVIEW
const enableVersionedDocs = process.env.ENABLE_VERSIONED_DOCS === 'true'
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
  fallback: 'blocking' as GetStaticPathsResult['fallback'],
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

DocsView.layout = WaypointIoLayout
export default DocsView
