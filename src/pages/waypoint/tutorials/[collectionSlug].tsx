import { ProductOption } from 'lib/learn-client/types'
import CollectionView from 'views/collection-view'
import {
  getCollectionPageProps,
  getCollectionPaths,
  CollectionPageProduct,
  CollectionPageProps,
} from 'views/collection-view/server'
import waypointData from 'data/waypoint.json'
import BaseLayout from 'layouts/base-new'

export function WaypointCollectionPage(
  props: CollectionPageProps
): React.ReactElement {
  return <CollectionView {...props} />
}

export async function getStaticProps({
  params,
}): Promise<{ props: CollectionPageProps }> {
  const { collectionSlug } = params
  const product = {
    slug: waypointData.slug,
    name: waypointData.name,
  } as CollectionPageProduct
  const props = await getCollectionPageProps(product, collectionSlug)
  return props
}

interface CollectionPagePaths {
  params: {
    collectionSlug: string
  }
}

export async function getStaticPaths(): Promise<{
  paths: CollectionPagePaths[]
  fallback: boolean
}> {
  const paths = await getCollectionPaths(ProductOption['waypoint'])
  return {
    paths,
    fallback: false,
  }
}

WaypointCollectionPage.layout = BaseLayout
export default WaypointCollectionPage
