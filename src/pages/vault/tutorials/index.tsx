import productData from 'data/vault.json'
import { LearnProductData } from 'types/products'
import {
  getProductTutorialsViewProps,
  ProductTutorialsViewProps,
} from 'views/product-tutorials-view/server'
import ProductTutorialsView from 'views/product-tutorials-view'

export async function getStaticProps(): Promise<{
  props: ProductTutorialsViewProps
}> {
  const props = await getProductTutorialsViewProps(
    productData as LearnProductData
  )

  return props
}

export default ProductTutorialsView
