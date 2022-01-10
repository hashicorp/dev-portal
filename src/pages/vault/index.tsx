import ProductLandingView from 'views/product-landing'
import server from 'views/product-landing/server'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getStaticProps() {
  const contentJsonFile = 'src/data/vault-landing.json'
  const product = { name: 'Vault', slug: 'vault' }
  return await server.getStaticProps({ product, contentJsonFile })
}

export default ProductLandingView
