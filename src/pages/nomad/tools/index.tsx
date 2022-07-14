import { ProductData } from 'types/products'
import ProductRootDocsPathLanding from 'views/product-root-docs-path-landing'
import { generateGetStaticProps } from 'views/product-root-docs-path-landing/server'
// product data
import nomadData from 'data/nomad.json'
// page content
import pageContent from './content.json'

const getStaticProps = generateGetStaticProps({
	pageContent,
	product: nomadData as ProductData,
	basePath: 'tools',
})

export { getStaticProps }
export default ProductRootDocsPathLanding
