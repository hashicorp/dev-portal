import { ReactElement } from 'react'
import terraformData from 'data/terraform.json'
import { Product } from 'types/products'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import DocsView from 'views/docs-view'

const basePath = 'intro'
const baseName = 'Intro'
const product = terraformData as Product
/**
 * TODO: productSlug should possibly actually be `terraform`,
 * but https://mktg-content-api.vercel.app/api/content/terraform/version-metadata?partial=true
 * does not return any version with "isLatest: true"
 */
const productSlugForLoader = 'terraform-website'

const TerraformIntroPage = ({ mdxSource }): ReactElement => {
  return <DocsView {...mdxSource} />
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
