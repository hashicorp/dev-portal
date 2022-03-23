import vagrantData from 'data/vagrant.json'
import ProductLandingView from 'views/product-landing'
import { generateStaticProps } from 'views/product-landing/server'
import { Product } from 'types/products'

export async function getStaticProps() {
  const contentJsonFile = 'src/data/vagrant-landing.json'
  const product = vagrantData as Product

  return {
    props: await generateStaticProps({ product, contentJsonFile }),
    revalidate: 10,
  }
}

export default ProductLandingView
