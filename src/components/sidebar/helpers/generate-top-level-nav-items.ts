import { ProductSlug } from 'types/products'
import { productSlugsToNames } from 'lib/products'

export const generateTopLevelNavItems = () => {
  const result = [
    {
      leadingIcon: 'home',
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
    const leadingIcon = productSlug
    const path = `/${productSlug}`

    result.push({ leadingIcon, path, title })
  })

  return result
}
