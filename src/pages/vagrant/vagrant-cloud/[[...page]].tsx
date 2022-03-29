import vagrantData from 'data/vagrant.json'
import { ProductData } from 'types/products'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import DocsView from 'views/docs-view'

const basePath = 'vagrant-cloud'
const baseName = 'Vagrant Cloud'
const product = vagrantData as ProductData

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  product,
  basePath,
  baseName,
})

export { getStaticPaths, getStaticProps }
export default DocsView
