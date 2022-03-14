import {
  Collection as ClientCollection,
  ProductOption,
} from 'lib/learn-client/types'
import { getProductTutorialsPageProps } from 'views/product-tutorials-view/server'
import waypointData from 'data/waypoint.json'
import ProductTutorialsView from 'views/product-tutorials-view'

export default function WaypointTutorialHubPage(props) {
  return <ProductTutorialsView {...props} />
}

export async function getStaticProps(): Promise<{
  props: { collections: ClientCollection[] }
}> {
  const product = {
    slug: ProductOption['waypoint'],
    name: waypointData.name,
  }
  const props = await getProductTutorialsPageProps(product)

  return props
}
