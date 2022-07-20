import waypointData from 'data/waypoint.json'
import pageContent from 'content/waypoint/docs-landing.json'
import { ProductData } from 'types/products'
import ProductRootDocsPathLanding from 'views/product-root-docs-path-landing'
import { generateGetStaticProps } from 'views/product-root-docs-path-landing/server'

const getStaticProps = generateGetStaticProps({
	includeMDXSource: true,
	pageContent,
	product: waypointData as ProductData,
	basePath: 'docs',
})

export { getStaticProps }
export default ProductRootDocsPathLanding
