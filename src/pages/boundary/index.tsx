import boundaryData from 'data/boundary.json'
import ProductLandingView from 'views/product-landing'
import { generateStaticProps } from 'views/product-landing/server'
import { Product } from 'types/products'

export async function getStaticProps() {
  const contentJsonFile = 'src/data/boundary-landing.json'
  const product = boundaryData as Product

  return {
    props: await generateStaticProps({ product, contentJsonFile }),
    revalidate: 10,
  }
}

export default ProductLandingView
