import { ReactElement } from 'react'
import terraformData from 'data/terraform.json'
import { Product } from 'types/products'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import DocsView from 'views/docs-view'

const basePath = 'language'
const baseName = 'Language'
const product = terraformData as Product
// TODO: productSlug should possibly actually be `terraform`,
// TODO: but https://mktg-content-api.vercel.app/api/content/terraform/version-metadata?partial=true
// TODO: does not return any version with "isLatest: true"
const productSlugForLoader = 'terraform-website'

const additionalComponents = {}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const TerraformIntroPage = ({ mdxSource }): ReactElement => {
  return <DocsView {...mdxSource} additionalComponents={additionalComponents} />
}

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  product,
  productSlugForLoader,
  basePath,
  baseName,
})

TerraformIntroPage.layout = SidebarSidecarLayout

export { getStaticPaths, getStaticProps }
export default TerraformIntroPage
