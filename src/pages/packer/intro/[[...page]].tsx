import packerData from 'data/packer.json'
import { ProductData } from 'types/products'
import DocsView from 'views/docs-view'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'

const basePath = 'intro'
const baseName = 'Intro'
const product = packerData as ProductData
const mainBranch = 'master'

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  product,
  basePath,
  baseName,
  mainBranch,
})

export { getStaticProps, getStaticPaths }
export default DocsView
