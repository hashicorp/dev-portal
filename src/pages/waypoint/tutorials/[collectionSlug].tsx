import waypointData from 'data/waypoint.json'
import { LearnProductData } from 'types/products'
import { ProductOption } from 'lib/learn-client/types'
import CollectionView from 'views/collection-view'
import {
  getCollectionPageProps,
  getCollectionPaths,
  CollectionPageProps,
} from 'views/collection-view/server'
import { GetStaticPropsResult } from 'next'

export async function getStaticProps({
  params,
}): Promise<GetStaticPropsResult<CollectionPageProps>> {
  const { collectionSlug } = params
  const product = waypointData as LearnProductData
  console.log('getting collectin page data')
  const props = await getCollectionPageProps(product, collectionSlug)

  // If the collection doesn't exist, hit the 404
  if (!props) {
    return { notFound: true }
  }

  return {
    props,
    revalidate: 300,
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
  const paths = await getCollectionPaths(ProductOption['waypoint'])
  return {
    paths,
    fallback: false,
  }
}

export default CollectionView
