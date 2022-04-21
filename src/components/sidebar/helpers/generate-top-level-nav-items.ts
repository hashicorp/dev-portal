import { ProductSlug } from 'types/products'
import { productSlugsToNames } from 'lib/products'

/**
 * Generates the top-level website nav data for rendering in `Sidebar` as the
 * top-level of the mobile navigation experience.
 *
 * Depends on the `__config.dev_dot.beta_product_slugs` variable to be set in
 * the current environment config.
 */
export const generateTopLevelSidebarNavData = () => {
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
