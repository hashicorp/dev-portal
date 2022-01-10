import ProductLandingView from 'views/product-landing'
import server from 'views/product-landing/server'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getStaticProps() {
  const contentJsonFile = 'src/data/waypoint-landing.json'
  const product = { name: 'Waypoint', slug: 'waypoint' }
  return await server.getStaticProps({ product, contentJsonFile })
}

export default ProductLandingView
