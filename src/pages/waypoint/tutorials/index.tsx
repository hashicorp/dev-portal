import { ProductOption } from 'lib/learn-client/types'
import {
  getProductTutorialsPageProps,
  ProductTutorialsPageProps,
} from 'views/product-tutorials-view/server'
import ProductTutorialsView from 'views/product-tutorials-view'
import BaseLayout from 'layouts/base-new'

export function WaypointTutorialHubPage(
  props: ProductTutorialsPageProps
): React.ReactElement {
  return <ProductTutorialsView {...props} />
}

export async function getStaticProps(): Promise<{
  props: ProductTutorialsPageProps
}> {
  const props = await getProductTutorialsPageProps(ProductOption['waypoint'])

  return props
}

WaypointTutorialHubPage.layout = BaseLayout
export default WaypointTutorialHubPage
