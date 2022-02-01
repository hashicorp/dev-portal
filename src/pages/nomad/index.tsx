import nomadData from 'data/nomad.json'
import ProductLandingView from 'views/product-landing'
import {
  generateStaticProps,
  LandingPageProduct,
} from 'views/product-landing/server'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getStaticProps() {
  const contentJsonFile = 'src/data/nomad-landing.json'
  const product = nomadData as LandingPageProduct

  return {
    props: await generateStaticProps({ product, contentJsonFile }),
    revalidate: 10,
  }
}

export default ProductLandingView
