import nomadData from 'data/nomad.json'
import { ProductData } from 'types/products'
import ProductLandingView from 'views/product-landing'
import { generateGetStaticProps } from 'views/product-landing/server'

const getStaticProps = generateGetStaticProps(nomadData as ProductData)

export { getStaticProps }
export default ProductLandingView
