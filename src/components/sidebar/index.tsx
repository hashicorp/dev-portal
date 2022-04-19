import { ReactElement, useMemo, useState } from 'react'
import useCurrentPath from 'hooks/use-current-path'
import SidebarBackToLink from './components/sidebar-back-to-link'
import SidebarFilterInput from './components/sidebar-filter-input'
import {
  SidebarNavMenuItem,
  SidebarSkipToMainContent,
  SidebarTitleHeading,
} from 'components/sidebar/components'
import { MenuItem, SidebarProps } from './types'
import s from './sidebar.module.css'

const SIDEBAR_LABEL_ID = 'sidebar-label'

const addItemMetadata = (
  currentPath: string,
  items: MenuItem[]
): { foundActiveItem: boolean; itemsWithMetadata: MenuItem[] } => {
  // `menuItems` is an optional prop, so nothing to do if `items` is undefined
  let foundActiveItem = false
  if (!items) {
    return { foundActiveItem, itemsWithMetadata: [] }
  }

  const itemsWithMetadata = items.map((item) => {
    const itemCopy = { ...item }

    if (item.routes) {
      const result = addItemMetadata(currentPath, item.routes)
      itemCopy.routes = result.itemsWithMetadata
      // Note: if an active item has already been found,
      // we do not flag this category as active.
      itemCopy.hasActiveChild = !foundActiveItem && result.foundActiveItem
      // Flag if we've found an active item
      foundActiveItem = itemCopy.hasActiveChild || foundActiveItem
    } else if (item.path) {
      // Note: if an active item has already been found,
      // we do not flag this node as active.
      itemCopy.isActive = !foundActiveItem && currentPath.endsWith(item.path)
      // Flag if we've found an active item
      foundActiveItem = itemCopy.isActive || foundActiveItem
    } else {
      // TODO: are there any other cases to cover?
    }

    return itemCopy
  })

  return { foundActiveItem, itemsWithMetadata }
}

/**
 * This does not use Array.filter because we need to add metadata to each item
 * that is used for determining the open/closed state of submenu items.
 */
const getFilteredMenuItems = (items: MenuItem[], filterValue: string) => {
  if (!filterValue) {
    return items
  }

  const filteredItems = []

  items.forEach((item) => {
    const itemCopy = { ...item }
    let matchingChildren: MenuItem[]
    let hasChildrenMatchingFilter = false

    const doesTitleMatchFilter = item?.title
      ?.toLowerCase()
      .includes(filterValue.toLowerCase())
    /**
     * If an item's title matches the filter, we want to include it and its
     * children in the filter results. `matchesFilter` is added to all items
     * with a title that matches, and is used in `SidebarNavSubmenu` to
     * determine if a submenu should be open when searching.
     *
     * If an item's title doesn't match the filter, then we need to recursively
     * look at the children of a submenu to see if any of those have titles or
     * subemnus that match the filter.
     *
     * TODO: write test cases to document this functionality more clearly
     */
    if (doesTitleMatchFilter) {
      itemCopy.matchesFilter = true
      filteredItems.push(itemCopy)
    } else if (item.routes) {
      matchingChildren = getFilteredMenuItems(item.routes, filterValue)
      hasChildrenMatchingFilter = matchingChildren.length > 0
      itemCopy.hasChildrenMatchingFilter = hasChildrenMatchingFilter
      itemCopy.routes = matchingChildren

      if (hasChildrenMatchingFilter) {
        filteredItems.push(itemCopy)
      }
    }
  })

  return filteredItems
}

const Sidebar = ({
  backToLinkProps,
  children,
  menuItems,
  showFilterInput = true,
  title,
  visuallyHideTitle = false,
}: SidebarProps): ReactElement => {
  const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
  const [filterValue, setFilterValue] = useState('')
  const { itemsWithMetadata } = useMemo(
    () => addItemMetadata(currentPath, menuItems),
    [currentPath, menuItems]
  )

  let backToLink
  if (backToLinkProps) {
    const { text, href } = backToLinkProps
    backToLink = <SidebarBackToLink text={text} href={href} />
  }

  let sidebarContent
  if (children) {
    sidebarContent = children
  } else {
    const filteredMenuItems = getFilteredMenuItems(
      itemsWithMetadata,
      filterValue
    )
    sidebarContent = (
      <ul className={s.navList}>
        {filteredMenuItems.map((item) => (
          <SidebarNavMenuItem item={item} key={item.id} />
        ))}
      </ul>
    )
  }

  return (
    <div className={s.sidebar}>
      {backToLink}
      {showFilterInput && (
        <SidebarFilterInput value={filterValue} onChange={setFilterValue} />
      )}
      <nav aria-labelledby={SIDEBAR_LABEL_ID} className={s.nav}>
        <div className={visuallyHideTitle ? 'g-screen-reader-only' : undefined}>
          <SidebarTitleHeading text={title} id={SIDEBAR_LABEL_ID} />
        </div>
        <SidebarSkipToMainContent />
        {sidebarContent}
      </nav>
    </div>
  )
}

export type { MenuItem, SidebarProps }
export default Sidebar
