import { ProductData } from 'types/products'

export const generateProductLandingNavItems = (product: ProductData) => {
  return [
    ...product.sidebar.landingPageNavData,
    { divider: true },
    ...product.sidebar.resourcesNavData,
  ]
}
