import boundaryData from 'data/boundary.json'
import ProductLandingView from 'views/product-landing'
import {
  generateStaticProps,
  LandingPageProduct,
} from 'views/product-landing/server'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getStaticProps() {
  const contentJsonFile = 'src/data/boundary-landing.json'
  const product = boundaryData as LandingPageProduct

  return {
    props: await generateStaticProps({ product, contentJsonFile }),
    revalidate: 10,
  }
}

export default ProductLandingView
