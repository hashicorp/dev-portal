import {
  ProductOption,
  ProductUsed as ClientProductUsed,
} from 'lib/learn-client/types'
import { Product as ProductContext } from 'types/products'

/**
 * Returns the active product from the array of 'ProductsUsed'
 * in the tutorial data, based on the theme of the current collection
 */

export function getCurrentProduct(
  productsUsed: ClientProductUsed[],
  currentTheme: ProductOption
): ProductContext {
  const { product } = productsUsed.find((p) => p.product.slug === currentTheme)
  return {
    slug: product.slug,
    name: product.name,
  }
}
