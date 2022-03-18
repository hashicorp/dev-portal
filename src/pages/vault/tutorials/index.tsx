import { ProductOption } from 'lib/learn-client/types'
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
  const props = await getProductTutorialsPageProps(ProductOption['vault'])

  return props
}

VaultTutorialHubPage.layout = BaseLayout
export default VaultTutorialHubPage
