import { ProductData } from 'types/products'

/**
 * Generates the Sidebar menuItems for product landing pages
 * (/waypoint, /vault, etc.).
 *
 * Written in a way that enables slow migration of products as they're released
 * in beta via the `rootDocsPaths` property defined in
 * `src/data/${productSlug}.json` files.
 *
 * @TODO remove the if-else once all products have a `rootDocsPaths` property
 * defined in their `src/data/${productSlug}.json` files.
 */
export const generateProductLandingSidebarMenuItems = (
  product: ProductData
) => {
  let menuItems

  if (product.rootDocsPaths) {
    const rootDocsNavItems = product.rootDocsPaths.map((rootDocsPath) => {
      const { shortName, name, path } = rootDocsPath
      return { title: shortName || name, fullPath: `/${product.slug}/${path}` }
    })
    menuItems = [
      ...rootDocsNavItems,
      {
        title: 'Tutorials',
        fullPath: `/${product.slug}/tutorials`,
      },
      {
        title: 'Install',
        fullPath: `/${product.slug}/downloads`,
      },
    ]
  } else {
    console.warn(
      `Warning (generateProductLandingSidebarMenuItems): ${product.name} does not have a "rootDocsPaths" property. Please replace the "landingPageNavData" property with "rootDocsPaths" in "src/data/${product.slug}.json".`
    )
    menuItems = [...product.sidebar.landingPageNavData]
  }

  return menuItems
}

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
  const menuItems = generateProductLandingSidebarMenuItems(product)
  const showFilterInput = false
  const title = product.name

  return {
    levelButtonProps,
    menuItems,
    showFilterInput,
    title,
  }
}
