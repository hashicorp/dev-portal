import camelcaseKeys from 'camelcase-keys'
import { traverse, isObject } from 'lib/traverse'
import { ProductPage } from 'lib/learn-client/types'
import { ApiPage } from '../api-types'

/**
 * Formats product page data by transforming all
 * object keys from snake_case to camelCase.
 */
export async function formatProductPage(
  pageRecord: ApiPage
): Promise<ProductPage> {
  const { slug, page_data } = pageRecord
  const camelCased = await traverse({ slug, page_data }, (_k, v) => {
    return isObject(v) ? camelcaseKeys(v) : v
  })
  return camelCased as unknown as ProductPage
}
