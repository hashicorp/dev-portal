import hcpData from 'data/hcp.json'
import ProductLandingView from 'views/product-landing'
import {
  generateStaticProps,
  LandingPageProduct,
} from 'views/product-landing/server'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getStaticProps() {
  const contentJsonFile = 'src/data/hcp-landing.json'
  const product = hcpData as LandingPageProduct

  return {
    props: await generateStaticProps({ product, contentJsonFile }),
    revalidate: 10,
  }
}

export default ProductLandingView
