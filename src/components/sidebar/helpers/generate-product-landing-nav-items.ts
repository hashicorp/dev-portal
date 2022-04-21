import { ProductData } from 'types/products'

/**
 * Given a `ProductData` object, generates the nav data for the `Sidebar` that
 * appears on the associated Product's `ProductLandingView` page (/vault,
 * /waypoint, etc.).
 *
 * Depends on the data located in the associated `src/data/${product.slug}.json`
 * to be loaded into the `product` object passed.
 */
export const generateProductLandingSidebarNavData = (product: ProductData) => {
  return [
    ...product.sidebar.landingPageNavData,
    { divider: true },
    ...product.sidebar.resourcesNavData,
  ]
}
