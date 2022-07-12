import sentinelData from 'data/sentinel.json'
import ProductLandingView from 'views/product-landing'
import { generateGetStaticProps } from 'views/product-landing/server'
import { ProductData } from 'types/products'

const { getStaticProps } = generateGetStaticProps(sentinelData as ProductData)

export { getStaticProps }
export default ProductLandingView
