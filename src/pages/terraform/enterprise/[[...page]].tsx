import { ReactElement } from 'react'
import terraformData from 'data/terraform.json'
import { Product } from 'types/products'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import DocsView from 'views/docs-view'

const basePath = 'enterprise'
const baseName = 'Enterprise'
const product = terraformData as Product
const productSlugForLoader = 'terraform-website'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const TerraformEnterprisePage = ({ mdxSource }): ReactElement => {
  return <DocsView mdxSource={mdxSource} />
}

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  product,
  productSlugForLoader,
  basePath,
  baseName,
})

TerraformEnterprisePage.layout = SidebarSidecarLayout

export { getStaticPaths, getStaticProps }
export default TerraformEnterprisePage
