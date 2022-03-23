import { ReactElement } from 'react'
import terraformData from 'data/terraform.json'
import { Product } from 'types/products'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import DocsView from 'views/docs-view'
import ProviderTable from 'components/author-primitives/terraform/provider-table'

const basePath = 'docs'
const baseName = 'Docs'
const product = terraformData as Product
const productSlugForLoader = 'terraform-website'

const additionalComponents = { ProviderTable }

const TerraformDocsPage = ({ mdxSource }): ReactElement => {
  return <DocsView {...mdxSource} additionalComponents={additionalComponents} />
}

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  product,
  productSlugForLoader,
  basePath,
  baseName,
})

TerraformDocsPage.layout = SidebarSidecarLayout

export { getStaticPaths, getStaticProps }
export default TerraformDocsPage
