import hcpData from 'data/hcp.json'
import ProductLandingView from 'views/product-landing'
import { generateGetStaticProps } from 'views/product-landing/server'
import { ProductData } from 'types/products'

const { getStaticProps } = generateGetStaticProps(hcpData as ProductData)

export { getStaticProps }
export default ProductLandingView
