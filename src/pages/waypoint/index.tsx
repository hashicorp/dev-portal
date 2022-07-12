import waypointData from 'data/waypoint.json'
import ProductLandingView from 'views/product-landing'
import { generateGetStaticProps } from 'views/product-landing/server'
import { ProductData } from 'types/products'

const { getStaticProps } = generateGetStaticProps(waypointData as ProductData)

export { getStaticProps }
export default ProductLandingView
