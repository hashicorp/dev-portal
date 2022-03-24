import terraformData from 'data/terraform.json'
import { Product } from 'types/products'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import DocsView from 'views/docs-view'

const basePath = 'plugin'
const baseName = 'Plugin'
const product = terraformData as Product
const productSlugForLoader = 'terraform-website'

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  product,
  productSlugForLoader,
  basePath,
  baseName,
})

export { getStaticPaths, getStaticProps }
export default DocsView
