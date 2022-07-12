import sentinelData from 'data/sentinel.json'
import { ProductData } from 'types/products'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import { sentinelUrlAdjuster } from 'layouts/sidebar-sidecar/utils/product-url-adjusters'
import DocsView from 'views/docs-view'

const basePath = 'intro'
const basePathForLoader = 'sentinel/intro'
const baseName = 'Intro'
const product = sentinelData as ProductData

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  product,
  basePath,
  basePathForLoader,
  baseName,
  additionalRemarkPlugins: [sentinelUrlAdjuster],
})

export { getStaticPaths, getStaticProps }
export default DocsView
