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
  const levelButtonProps = {
    levelUpButtonText: 'Main Menu',
    levelDownButtonText: 'Previous',
  }
  const menuItems = [...product.sidebar.landingPageNavData]
  const showFilterInput = false
  const title = product.name

  return {
    levelButtonProps,
    menuItems,
    showFilterInput,
    title,
  }
}
