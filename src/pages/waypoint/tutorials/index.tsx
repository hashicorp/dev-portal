import { ProductOption } from 'lib/learn-client/types'
import {
  getProductTutorialsPageProps,
  ProductTutorialsPageProps,
} from 'views/product-tutorials-view/server'
import waypointData from 'data/waypoint.json'
import ProductTutorialsView from 'views/product-tutorials-view'

export default function WaypointTutorialHubPage(
  props: ProductTutorialsPageProps
): React.ReactElement {
  return <ProductTutorialsView {...props} />
}

export async function getStaticProps(): Promise<{
  props: ProductTutorialsPageProps
}> {
  // @TODO consider sourcing the product data from the API
  const product = {
    slug: ProductOption['waypoint'],
    name: waypointData.name,
  }
  const props = await getProductTutorialsPageProps(product)

  return props
}
