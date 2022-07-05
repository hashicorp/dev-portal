import terraformData from 'data/terraform.json'
import { ProductData } from 'types/products'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import DocsView from 'views/docs-view'

const basePath = 'registry'
const baseName = 'Registry'
const product = terraformData as ProductData
const productSlugForLoader = 'terraform-website'

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
	product,
	productSlugForLoader,
	basePath,
	baseName,
})

export { getStaticPaths, getStaticProps }
export default DocsView
