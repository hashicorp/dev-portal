import consulData from 'data/consul.json'
import ProductLandingView from 'views/product-landing'
import { generateGetStaticProps } from 'views/product-landing/server'
import { ProductData } from 'types/products'

const { getStaticProps } = generateGetStaticProps(consulData as ProductData)

export { getStaticProps }
export default ProductLandingView
