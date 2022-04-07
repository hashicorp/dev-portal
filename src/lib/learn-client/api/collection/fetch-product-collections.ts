import {
  Collection,
  uuid,
  ProductOption,
  AllCollectionsProductOptions,
} from 'lib/learn-client/types'
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
 *
 * Optional query params will return collections 
 * sorted according to the category sidebar sort (which automatically
 * includes filtering for theme
 */
export async function fetchAllCollectionsByProduct(
  product: AllCollectionsProductOptions
): Promise<Collection[]> {
  const baseUrl = PRODUCT_COLLECTION_API_ROUTE(product.slug)
  let route = baseUrl

  if (product.sidebarSort) {
    const params = new URLSearchParams([
      ['topLevelCategorySort', 'true'],
      ['theme', product.slug],
    ])

    route = baseUrl + `?${params.toString()}`
  }

  const getProductCollectionsRes = await get(route)

  if (getProductCollectionsRes.ok) {
    const res = await getProductCollectionsRes.json()
    return res.result
  }

  const error = toError(getProductCollectionsRes)
  throw error
}
