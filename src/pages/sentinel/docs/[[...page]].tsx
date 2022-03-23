import { ReactElement } from 'react'
import SentinelEmbedded from '@hashicorp/react-sentinel-embedded'
import sentinelData from 'data/sentinel.json'
import { Product } from 'types/products'
import remarkSentinel from 'lib/remark-sentinel'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { sentinelUrlAdjuster } from 'layouts/sidebar-sidecar/utils/product-url-adjusters'
import DocsView from 'views/docs-view'

const basePath = 'docs'
const basePathForLoader = 'sentinel'
const baseName = 'Docs'
const product = sentinelData as Product
const additionalComponents = { SentinelEmbedded }

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const SentinelDocsPage = ({ mdxSource }): ReactElement => {
  return (
    <DocsView
      mdxSource={mdxSource}
      additionalComponents={additionalComponents}
    />
  )
}

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  product,
  basePath,
  basePathForLoader,
  baseName,
  additionalRemarkPlugins: [sentinelUrlAdjuster, remarkSentinel],
})

SentinelDocsPage.layout = SidebarSidecarLayout

export { getStaticPaths, getStaticProps }
export default SentinelDocsPage
