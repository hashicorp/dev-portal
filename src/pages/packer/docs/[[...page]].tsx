import packerData from 'data/packer.json'
import { Product } from 'types/products'
import DocsView from 'views/docs-view'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'

const basePath = 'docs'
const baseName = 'Docs'
const product = packerData as Product
const mainBranch = 'master'

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  product,
  basePath,
  baseName,
  mainBranch,
})

export { getStaticProps, getStaticPaths }
export default DocsView
