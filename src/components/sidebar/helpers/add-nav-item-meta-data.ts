import {
  EnrichedNavItem,
  EnrichedSubmenuNavItem,
  NavItemWithMetaData,
  SubmenuNavItemWithMetaData,
  LinkNavItemWithMetaData,
  EnrichedLinkNavItem,
} from 'components/sidebar/types'

interface AddNavItemMetaDataResult {
  foundActiveItem: boolean
  itemsWithMetadata: NavItemWithMetaData[]
}

export const addNavItemMetaData = (
  currentPath: string,
  items: EnrichedNavItem[]
): AddNavItemMetaDataResult => {
  let foundActiveItem = false

  const itemsWithMetadata = items.map(
    (item: EnrichedNavItem): NavItemWithMetaData => {
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

      return { ...item } as NavItemWithMetaData
    }
  )

  return { foundActiveItem, itemsWithMetadata }
}
