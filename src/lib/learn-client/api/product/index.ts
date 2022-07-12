import { identifier, Product } from 'lib/learn-client/types'
import path from 'path'
import { get, toError } from '../../index'
import { formatIdentifier, formatBatchQueryStr } from '../utils'
import { formatProduct } from './formatting'

const PRODUCT_API_ROUTE = '/products'

// getProduct
export async function getProduct(idOrSlug: identifier): Promise<Product> {
  const identifier = formatIdentifier(idOrSlug)

  // /products/:identifier
  const route = path.join(PRODUCT_API_ROUTE, identifier)
  const getProductRes = await get(route)

  if (getProductRes.ok) {
    const res = await getProductRes.json()
    return formatProduct(res.result)
  }

  const error = await toError(getProductRes)
  throw error
}

// getProducts
export async function getProducts(
  idsOrSlugs: identifier[]
): Promise<Product[]> {
  const queryStr = formatBatchQueryStr(idsOrSlugs)

  // /products?slugs=option,option or /products?ids=option,option
  const route = PRODUCT_API_ROUTE + queryStr
  const getProductsRes = await get(route)

  if (getProductsRes.ok) {
    const res = await getProductsRes.json()
    return res.result.map(formatProduct)
  }

  const error = await toError(getProductsRes)
  throw error
}
