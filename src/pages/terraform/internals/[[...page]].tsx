import terraformData from 'data/terraform.json'
import { ProductData } from 'types/products'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import DocsView from 'views/docs-view'

const basePath = 'internals'
const baseName = 'Internals'
const product = terraformData as ProductData
/**
 * TODO: productSlug should possibly actually be `terraform`,
 * but https://content.hashicorp.com/api/content/terraform/version-metadata?partial=true
 * does not return any version with "isLatest: true"
 */
const productSlugForLoader = 'terraform-website'

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  product,
  productSlugForLoader,
  basePath,
  baseName,
})

export { getStaticPaths, getStaticProps }
export default DocsView
