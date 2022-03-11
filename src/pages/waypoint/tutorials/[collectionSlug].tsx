/**
 * TODO - create proper view
 */

import {
  getAllCollections,
  getCollection,
} from 'lib/learn-client/api/collection'
import {
  Collection as ClientCollection,
  ProductOption,
} from 'lib/learn-client/types'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { splitProductFromFilename } from 'views/tutorial-view/helpers'
import CollectionView from 'views/collection-view'

export default function WaypointCollectionPage(props) {
  return <CollectionView {...props.collection} />
}

export async function getStaticProps({
  params,
}): Promise<{ props: { collection: ClientCollection } }> {
  const { collectionSlug } = params
  const collection = await getCollection(
    `${ProductOption['waypoint']}/${collectionSlug}`
  )

  return {
    props: {
      collection: stripUndefinedProperties(collection),
    },
  }
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
  const collections = await getAllCollections({
    product: ProductOption['waypoint'],
  })
  const paths = collections.map((collection) => ({
    params: {
      collectionSlug: splitProductFromFilename(collection.slug),
    },
  }))
  return {
    paths,
    fallback: false,
  }
}
