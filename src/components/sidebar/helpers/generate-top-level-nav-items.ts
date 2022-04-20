import { ProductSlug } from 'types/products'
import { productSlugsToNames } from 'lib/products'

export const generateTopLevelNavItems = () => {
  const result = [
    {
      leadingIconName: 'home',
      href: '/',
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
    const href = `/${productSlug}`

    result.push({ leadingIconName, href, title })
  })

  return result
}
