import packerData from 'data/packer.json'
import ProductLandingView from 'views/product-landing'
import { generateStaticProps } from 'views/product-landing/server'
import { Product } from 'types/products'

export async function getStaticProps() {
  const contentJsonFile = 'src/data/packer-landing.json'
  const product = packerData as Product

  return {
    props: await generateStaticProps({ product, contentJsonFile }),
    revalidate: 10,
  }
}

export default ProductLandingView
