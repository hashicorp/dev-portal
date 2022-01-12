import ProductLandingView from 'views/product-landing'
import { generateStaticProps } from 'views/product-landing/server'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getStaticProps() {
  const contentJsonFile = 'src/data/waypoint-landing.json'
  const product = { name: 'Waypoint', slug: 'waypoint' }
  return {
    props: await generateStaticProps({ product, contentJsonFile }),
    revalidate: 10,
  }
}

export default ProductLandingView
