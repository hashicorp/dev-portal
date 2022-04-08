import { ProductSlug } from 'types/products'

/**
 * Given a `ProductSlug`, returns `true` if the associated Product is a beta
 * product and `false` otherwise. Intended for use in server-side code. If this
 * data is needed client-side, use the more optimized `useIsProductBeta` hook
 * provided by `AllProductDataProvider`.
 */
const getIsBetaProduct = (productSlug: ProductSlug): boolean => {
  const betaProductSlugs = __config.dev_dot.beta_product_slugs
  return betaProductSlugs.some((slug: ProductSlug) => productSlug === slug)
}

export default getIsBetaProduct
