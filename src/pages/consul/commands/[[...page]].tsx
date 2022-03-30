import consulData from 'data/consul.json'
import { ProductData } from 'types/products'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import DocsView from 'views/docs-view'
import { consulUrlAdjuster } from 'layouts/sidebar-sidecar/utils/product-url-adjusters'

const basePath = 'commands'
const baseName = 'CLI'
const product = consulData as ProductData

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  product,
  basePath,
  baseName,
  additionalRemarkPlugins: [consulUrlAdjuster],
})

export { getStaticPaths, getStaticProps }
export default DocsView
