import waypointData from 'data/waypoint.json'
import ProductLandingView from 'views/product-landing'
import { generateStaticProps } from 'views/product-landing/server'
import { ProductData } from 'types/products'

export async function getStaticProps() {
  const contentJsonFile = 'src/data/waypoint-landing.json'
  const product = waypointData as ProductData

  return {
    props: await generateStaticProps({ product, contentJsonFile }),
    revalidate: 10,
  }
}

export default ProductLandingView
