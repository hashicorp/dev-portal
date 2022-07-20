import nomadData from 'data/nomad.json'
import pageContent from 'content/nomad/docs-landing.json'
import { ProductData } from 'types/products'
import ProductRootDocsPathLanding from 'views/product-root-docs-path-landing'
import { generateGetStaticProps } from 'views/product-root-docs-path-landing/server'

const getStaticProps = generateGetStaticProps({
	pageContent,
	product: nomadData as ProductData,
	basePath: 'docs',
})

export { getStaticProps }
export default ProductRootDocsPathLanding
