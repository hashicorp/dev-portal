import {
  EnrichedLinkNavItem,
  EnrichedNavItem,
  EnrichedSubmenuNavItem,
  LinkNavItemWithMetaData,
  NavItemWithMetaData,
  SubmenuNavItemWithMetaData,
} from 'components/sidebar/types'

interface AddNavItemMetaDataResult {
  foundActiveItem: boolean
  itemsWithMetadata: NavItemWithMetaData[]
}

/**
 * Handles adding meta data to `Sidebar` `EnrichedNavItem` objects.
 *  - For `EnrichedLinkNavItem` objects, an `isActive` property will be added.
 *  - For `EnrichedSubmenuNavItem` objects:
 *      - a `hasActiveChild` property will be added
 *      - the `routes` property will be updated to be an array of
 *        `NavItemWithMetaData` objects via a recursive call to this function
 *
 * The shape of the returned object is defined as such so that only one nav item
 * is determined to be "active". Once the first "active" item is found, all
 * subsequent items will not be checked for whether or not they're active.
 */
export const addNavItemMetaData = (
  currentPath: string,
  items: EnrichedNavItem[]
): AddNavItemMetaDataResult => {
  let foundActiveItem = false

  const itemsWithMetadata = items.map(
    (item: EnrichedNavItem): NavItemWithMetaData => {
      // Found an `EnrichedSubmenuNavItem` object
      if (item.hasOwnProperty('routes')) {
        const result = addNavItemMetaData(
          currentPath,
          (item as EnrichedSubmenuNavItem).routes
        )
        const hasActiveChild = !foundActiveItem && result.foundActiveItem

        foundActiveItem = hasActiveChild || foundActiveItem

        return {
          ...item,
          routes: result.itemsWithMetadata,
          hasActiveChild,
        } as SubmenuNavItemWithMetaData
      }

      // Found an `EnrichedLinkNavItem` object
      if (item.hasOwnProperty('path')) {
        const isActive =
          !foundActiveItem &&
          currentPath.endsWith((item as EnrichedLinkNavItem).path)

        foundActiveItem = isActive || foundActiveItem

        return {
          ...item,
          isActive,
        } as LinkNavItemWithMetaData
      }

      // Found `DividerNavItem` or `HeadingNavItem` object, do not modify
      return { ...item } as NavItemWithMetaData
    }
  )

  return { foundActiveItem, itemsWithMetadata }
}
