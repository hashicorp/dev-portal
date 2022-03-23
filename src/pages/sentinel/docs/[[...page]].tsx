import sentinelData from 'data/sentinel.json'
import { Product } from 'types/products'
import remarkSentinel from 'lib/remark-sentinel'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import { sentinelUrlAdjuster } from 'layouts/sidebar-sidecar/utils/product-url-adjusters'
import DocsView from 'views/docs-view'

const basePath = 'docs'
const basePathForLoader = 'sentinel'
const baseName = 'Docs'
const product = sentinelData as Product

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  product,
  basePath,
  basePathForLoader,
  baseName,
  additionalRemarkPlugins: [sentinelUrlAdjuster, remarkSentinel],
})

export { getStaticPaths, getStaticProps }
export default DocsView
