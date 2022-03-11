import path from 'path'
import { formatIdentifier, formatBatchQueryStr, fetchAll } from '../utils'
import { ApiCollection } from '../api-types'
import {
  identifier,
  Collection,
  getAllCollectionsOptions,
  themeIsProduct,
} from 'lib/learn-client/types'
import { get, toError } from '../../index'
import { fetchAllCollectionsByProduct } from './fetch-product-collections'
import { formatCollection } from './formatting'

const COLLECTION_API_ROUTE = '/collections'

// getCollection
export async function getCollection(idOrSlug: identifier): Promise<Collection> {
  const identifier = formatIdentifier(idOrSlug)

  // /collections/:id
  const route = path.join(COLLECTION_API_ROUTE, identifier)
  const getCollectionRes = await get(route)

  if (getCollectionRes.ok) {
    const res = await getCollectionRes.json()
    return formatCollection(res.result)
  }

  const error = toError(getCollectionRes)
  throw error
}

// getCollections
export async function getCollections(
  idsOrSlugs: identifier[]
): Promise<Collection[]> {
  const queryStr = formatBatchQueryStr(idsOrSlugs)

  // /collections?ids|slugs=....
  const route = COLLECTION_API_ROUTE + queryStr
  const getCollectionsRes = await get(route)

  if (getCollectionsRes.ok) {
    const res = await getCollectionsRes.json()
    return res.result.map(formatCollection)
  }

  const error = toError(getCollectionsRes)
  throw error
}

/**
 * getAllCollections accepts a limit or product option.
 * The limit option allows you to specify how many collections to fetch.
 * The product option returns all collections associated with that product.
 * If no options are passed, all collections are fetched.
 */

export async function getAllCollections(
  options?: getAllCollectionsOptions
): Promise<Collection[]> {
  let collections = []

  // check if the product option is valid, i.e. not 'cloud' or 'hashicorp'
  if (options?.product && themeIsProduct(options.product)) {
    const allCollections = await fetchAllCollectionsByProduct(options.product)

    collections = [...allCollections]
  } else {
    const limit = options?.limit?.toString()
    const recurse = Boolean(!limit)

    // errors handled by the `fetchAll` function
    const allCollections = (await fetchAll({
      baseUrl: COLLECTION_API_ROUTE,
      recurse,
      limit,
    })) as ApiCollection[]

    collections = [...allCollections]
  }

  return collections.map(formatCollection)
}
