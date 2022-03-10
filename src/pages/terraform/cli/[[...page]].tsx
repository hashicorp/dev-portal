import { ReactElement } from 'react'
import terraformData from 'data/terraform.json'
import { Product } from 'types/products'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import DocsView from 'views/docs-view'

const basePath = 'cli'
const baseName = 'CLI'
const product = terraformData as Product
// TODO: productSlug should possibly actually be `terraform`,
// TODO: but https://mktg-content-api.vercel.app/api/content/terraform/version-metadata?partial=true
// TODO: does not return any version with "isLatest: true"
const productSlugForLoader = 'terraform-website'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const TerraformCliPage = ({ mdxSource }): ReactElement => {
  return <DocsView {...mdxSource} />
}

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  product,
  productSlugForLoader,
  basePath,
  baseName,
})

TerraformCliPage.layout = SidebarSidecarLayout

export { getStaticPaths, getStaticProps }
export default TerraformCliPage
