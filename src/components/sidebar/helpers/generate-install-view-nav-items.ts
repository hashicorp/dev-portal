import { MenuItem } from '../types'
import { ProductData } from 'types/products'
import { generateProductLandingSidebarMenuItems } from './generate-product-landing-nav-items'

/**
 * Given a `ProductData` object, generates the nav data for the `Sidebar` that
 * appears on the associated Product's `ProductDownloads` page
 * (/vault/downloads, /waypoint/downloads, etc.).
 *
 * Depends on the data located in the associated `src/data/${product.slug}.json`
 * to be loaded into the `product` object passed.
 *
 * Can optionally be passed menuItems, which determine sidebar content.
 * If menuItems are not provided, falls back to a default generated set
 * identical to the items shown on product landing views.
 */
export const generateInstallViewNavItems = (
  product: ProductData,
  menuItems?: MenuItem[]
) => {
  const backToLinkProps = {
    text: `${product.name} Home`,
    href: `/${product.slug}`,
  }
  const levelButtonProps = {
    levelUpButtonText: 'Main Menu',
    levelDownButtonText: 'Previous',
  }
  const menuItemsWithFallback = menuItems
    ? menuItems
    : generateProductLandingSidebarMenuItems(product)
  const showFilterInput = false
  const title = 'Install'

  return {
    backToLinkProps,
    levelButtonProps,
    menuItems: menuItemsWithFallback,
    showFilterInput,
    title,
  }
}
