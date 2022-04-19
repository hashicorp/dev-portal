import productData from 'data/waypoint.json'
import { LearnProductData } from 'types/products'
import {
  getProductTutorialsPageProps,
  ProductTutorialsPageProps,
} from 'views/product-tutorials-view/server'
import ProductTutorialsView from 'views/product-tutorials-view'

export default function WaypointTutorialHubPage(
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
