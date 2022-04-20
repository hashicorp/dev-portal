import { ProductSlug } from 'types/products'
import { productSlugsToNames } from 'lib/products'

export const generateTopLevelNavItems = () => {
  const result = [
    {
      leadingIconName: 'home',
      path: '/',
      title: 'Developer Home',
    },
    {
      divider: true,
    },
  ]

  const betaProductSlugs = __config.dev_dot.beta_product_slugs
  betaProductSlugs.forEach((productSlug: ProductSlug) => {
    const title = productSlugsToNames[productSlug]
    const leadingIconName = productSlug
    const path = `/${productSlug}`

    result.push({ leadingIconName, path, title })
  })

  return result
}
