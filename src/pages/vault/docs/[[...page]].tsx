import vaultData from 'data/vault.json'
import { Product } from 'types/products'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import DocsView from 'views/docs-view'
import { vaultUrlAdjuster } from 'layouts/sidebar-sidecar/utils/product-url-adjusters'

const basePath = 'docs'
const baseName = 'Docs'
const product = vaultData as Product

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  product,
  basePath,
  baseName,
  additionalRemarkPlugins: [vaultUrlAdjuster],
})

export { getStaticPaths, getStaticProps }
export default DocsView
