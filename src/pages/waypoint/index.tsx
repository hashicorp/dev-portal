import waypointData from 'data/waypoint.json'
import { Product } from 'types/products'
import ProductLandingView from 'views/product-landing'
import { generateStaticProps } from 'views/product-landing/server'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getStaticProps() {
  const contentJsonFile = 'src/data/waypoint-landing.json'
  const product = waypointData as Product

  return {
    props: await generateStaticProps({ product, contentJsonFile }),
    revalidate: 10,
  }
}

export default ProductLandingView
