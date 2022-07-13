import terraformData from 'data/terraform.json'
import { ProductData } from 'types/products'
import ProductRootDocsPathLanding from 'views/product-root-docs-path-landing'
import { generateGetStaticProps } from 'views/product-root-docs-path-landing/server'
import pageContent from './content.json'

const getStaticProps = generateGetStaticProps({
	pageContent,
	product: terraformData as ProductData,
})

export { getStaticProps }
export default ProductRootDocsPathLanding
