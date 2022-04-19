import productData from 'data/vault.json'
import { LearnProductData } from 'types/products'
import {
  getProductTutorialsPageProps,
  ProductTutorialsPageProps,
} from 'views/product-tutorials-view/server'
import ProductTutorialsView from 'views/product-tutorials-view'

export default function VaultTutorialHubPage(
  props: ProductTutorialsPageProps
): React.ReactElement {
  return <ProductTutorialsView {...props} />
}

export async function getStaticProps(): Promise<{
  props: ProductTutorialsPageProps
}> {
  const props = await getProductTutorialsPageProps(
    productData as LearnProductData
  )

  return props
}
