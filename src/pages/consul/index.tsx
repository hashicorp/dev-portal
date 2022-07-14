import consulData from 'data/consul.json'
import { ProductData } from 'types/products'
import ProductLandingView from 'views/product-landing'
import { generateGetStaticProps } from 'views/product-landing/server'

const getStaticProps = generateGetStaticProps(consulData as ProductData)

export { getStaticProps }
export default ProductLandingView
