import waypointData from 'data/waypoint.json'
import { ProductData } from 'types/products'
import ProductRootDocsPathLanding from 'views/product-root-docs-path-landing'
import { generateGetStaticProps } from 'views/product-root-docs-path-landing/server'
import pageContent from './content.json'

const getStaticProps = generateGetStaticProps({
  includeMDXSource: true,
  pageContent,
  product: waypointData as ProductData,
})

export { getStaticProps }
export default ProductRootDocsPathLanding
