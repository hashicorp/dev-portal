import { GetStaticPropsResult } from 'next'
import vaultData from 'data/vault.json'
import { LearnProductData } from 'types/products'
import { ProductOption } from 'lib/learn-client/types'
import CollectionView from 'views/collection-view'
import {
  getCollectionPageProps,
  getCollectionPaths,
  CollectionPageProps,
} from 'views/collection-view/server'

export async function getStaticProps({
  params,
}): Promise<GetStaticPropsResult<CollectionPageProps>> {
  const { collectionSlug } = params
  const product = vaultData as LearnProductData

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
  const paths = await getCollectionPaths(ProductOption['vault'])
  return {
    paths,
    fallback: false,
  }
}

export default CollectionView
