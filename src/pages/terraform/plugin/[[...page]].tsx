import { ReactElement } from 'react'
import terraformData from 'data/terraform.json'
import { Product } from 'types/products'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import DocsView from 'views/docs-view'

const basePath = 'plugin'
const baseName = 'Plugin'
const product = terraformData as Product
const productSlugForLoader = 'terraform-website'

const TerraformPluginPage = ({ mdxSource }): ReactElement => {
  return <DocsView {...mdxSource} />
}

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  product,
  productSlugForLoader,
  basePath,
  baseName,
})

TerraformPluginPage.layout = SidebarSidecarLayout

export { getStaticPaths, getStaticProps }
export default TerraformPluginPage
