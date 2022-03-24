import nomadData from 'data/nomad.json'
import { Product } from 'types/products'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import DocsView from 'views/docs-view'

const basePath = 'api-docs'
const baseName = 'API'
const product = nomadData as Product

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  product,
  basePath,
  baseName,
})

export { getStaticPaths, getStaticProps }
export default DocsView
