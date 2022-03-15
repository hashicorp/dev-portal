import sentinelData from 'data/sentinel.json'
import ProductLandingView from 'views/product-landing'
import { generateStaticProps } from 'views/product-landing/server'
import { Product } from 'types/products'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getStaticProps() {
  const contentJsonFile = 'src/data/sentinel-landing.json'
  const product = sentinelData as Product

  return {
    props: await generateStaticProps({ product, contentJsonFile }),
    revalidate: 10,
  }
}

export default ProductLandingView
