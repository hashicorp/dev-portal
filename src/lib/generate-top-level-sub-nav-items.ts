import { ProductSlug } from 'types/products'
import getIsBetaProduct from 'lib/get-is-beta-product'
import { productSlugsToNames } from 'lib/products'

export const generateTopLevelSubNavItems = () => {
  const betaProductItems = []
  const futureProductItems = []

  Object.keys(productSlugsToNames).forEach((productSlug: ProductSlug) => {
    // Exclude Sentinel for now
    if (productSlug === 'sentinel') {
      return
    }

    const leadingIconName = productSlug
    const title = productSlugsToNames[productSlug]
    const navItem: $TSFixMe = { leadingIconName, title }
    const isBetaProduct = getIsBetaProduct(productSlug)
    if (isBetaProduct) {
      navItem.href = `/${productSlug}`
      navItem.badge = { color: 'highlight', text: 'Beta' }
      betaProductItems.push(navItem)
    } else {
      navItem.ariaLabel = `Coming soon: ${title}`
      futureProductItems.push(navItem)
    }
  })

  return [
    {
      leadingIconName: 'home',
      title: 'HashiCorp Developer',
      href: '/',
    },
    { divider: true },
    { heading: 'Products' },
    ...betaProductItems,
    { divider: true },
    { heading: 'Coming Soon' },
    ...futureProductItems,
  ]
}
