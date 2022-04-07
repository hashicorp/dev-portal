import productData from 'data/vault.json'
import { ProductData } from 'types/products'
import {
  getProductTutorialsPageProps,
  ProductTutorialsPageProps,
} from 'views/product-tutorials-view/server'
import ProductTutorialsView from 'views/product-tutorials-view'
import BaseLayout from 'layouts/base-new'

export function VaultTutorialHubPage(
  props: ProductTutorialsPageProps
): React.ReactElement {
  return <ProductTutorialsView {...props} />
}

export async function getStaticProps(): Promise<{
  props: ProductTutorialsPageProps
}> {
  const props = await getProductTutorialsPageProps(productData as ProductData)

  return props
}

VaultTutorialHubPage.layout = BaseLayout
export default VaultTutorialHubPage
