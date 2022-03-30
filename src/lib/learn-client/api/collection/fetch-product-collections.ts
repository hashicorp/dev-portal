import { Collection, uuid, ProductOption } from 'lib/learn-client/types'
import { get, toError } from '../../index'

// /products/:identifier/collections
export const PRODUCT_COLLECTION_API_ROUTE = (
  identifier: ProductOption | uuid
) => `/products/${identifier}/collections`

/**
 * Returns all collections associated with a product.
 * Collections will be product associated if they have at least
 * one tutorial whose primary product (first in frontmatter array)
 * matches this product slug
 */
export async function fetchAllCollectionsByProduct(
  identifier: ProductOption | uuid
): Promise<Collection[]> {
  const route = PRODUCT_COLLECTION_API_ROUTE(identifier)
  const getProductCollectionsRes = await get(route)

  if (getProductCollectionsRes.ok) {
    const res = await getProductCollectionsRes.json()
    return res.result
  }

  const error = toError(getProductCollectionsRes)
  throw error
}
