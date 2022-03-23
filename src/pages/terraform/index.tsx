import terraformData from 'data/terraform.json'
import ProductLandingView from 'views/product-landing'
import { generateStaticProps } from 'views/product-landing/server'
import { Product } from 'types/products'

export async function getStaticProps() {
  const contentJsonFile = 'src/data/terraform-landing.json'
  const product = terraformData as Product

  return {
    props: await generateStaticProps({ product, contentJsonFile }),
    revalidate: 10,
  }
}

export default ProductLandingView
