import { ReactElement } from 'react'
import terraformData from 'data/terraform.json'
import { Product } from 'types/products'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import DocsView from 'views/docs-view'

const basePath = 'registry'
const baseName = 'Registry'
const product = terraformData as Product
const productSlugForLoader = 'terraform-website'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const TerraformRegistryPage = ({ mdxSource }): ReactElement => {
  return <DocsView mdxSource={mdxSource} />
}

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  product,
  productSlugForLoader,
  basePath,
  baseName,
})

TerraformRegistryPage.layout = SidebarSidecarLayout

export { getStaticPaths, getStaticProps }
export default TerraformRegistryPage
