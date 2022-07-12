import terraformData from 'data/terraform.json'
import ProductLandingView from 'views/product-landing'
import { generateGetStaticProps } from 'views/product-landing/server'
import { ProductData } from 'types/products'

const { getStaticProps } = generateGetStaticProps(terraformData as ProductData)

export { getStaticProps }
export default ProductLandingView
