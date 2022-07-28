import terraformData from 'data/terraform.json'
import { ProductData } from 'types/products'
import { getStaticGenerationFunctions } from 'views/docs-view/utils/all-docs-server'
import DocsView from 'views/docs-view'

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
	productData: terraformData as ProductData,
})

export { getStaticPaths, getStaticProps }
export default DocsView
