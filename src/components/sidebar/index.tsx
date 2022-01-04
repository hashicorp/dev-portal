import { useMemo, useState } from 'react'
import useCurrentPath from 'hooks/use-current-path'
import SidebarBackToLink from './components/sidebar-back-to-link'
import SidebarFilterInput from './components/sidebar-filter-input'
import SidebarNav from './components/sidebar-nav'
import s from './style.module.css'

/**
 *
 * For reference: this is also defined in react-components/docs-sidenav:
 * https://github.com/hashicorp/react-components/blob/main/packages/docs-sidenav/types.ts
 *
 */
export interface MenuItem {
  divider?: boolean
  hasActiveChild?: boolean
  href?: string
  isActive?: boolean
  path?: string
  routes?: MenuItem[]
  title?: string
  /* Temporary solution to allow rendering of unlinked headings, as in designs */
  heading?: string
  /* Temporary solution to show external link icon, for demo purposes */
  _demoExternalLink?: boolean
}

interface SidebarProps {
  menuItems: MenuItem[]
  /** Optional path strings representing the path from the root URL.
   * Note: this is a temporary solution to allow basePaths to be set, rather than derived
   * from current location. This allows a bit more flexibility in where the nav
   * can be placed (eg can then be placed on /waypoint, rather than only
   * working on /waypoint/docs)
   **/
  basePaths?: string[]
}

/**
 * TODO: update & rename to add additional metadata
 *   - fullPath: the full subpath of a non-submenu item (currently handled in sidebar-nav-menu-item)
 *   - id: a generated slug based off of title and/or fullPath (depends if it's a submenu)
 */
const addActiveStateMetadata = (
  currentPath: string,
  items: MenuItem[]
): { foundActiveItem: boolean; itemsWithMetadata: MenuItem[] } => {
  let foundActiveItem = false

  const itemsWithMetadata = items.map((item) => {
    const itemCopy = { ...item }

    if (item.divider) {
      return itemCopy
    }

    if (foundActiveItem) {
      itemCopy[item.routes ? 'hasActiveChild' : 'isActive'] = false
    } else if (item.routes) {
      const result = addActiveStateMetadata(currentPath, item.routes)
      foundActiveItem = result.foundActiveItem
      itemCopy.routes = result.itemsWithMetadata
      itemCopy.hasActiveChild = result.foundActiveItem
    } else {
      foundActiveItem = currentPath.endsWith(item.path)
      itemCopy.isActive = foundActiveItem
    }

    return itemCopy
  })

  return { foundActiveItem, itemsWithMetadata }
}

/**
 * TODO: this correctly finds the items that match `filterValue`, but if the item is a child
 * of a submenu, that submenu isn't open after searching. `filter` creates a new array, so maybe
 * there is an attribute we can add to the submenus that should be open, such as `hasChildMatchingFilter`.
 * Then we can check that value when initializing `isOpen` in the `SidebarNavSubmenu` sub component.
 */
const getFilteredMenuItems = (items: MenuItem[], filterValue: string) => {
  if (!filterValue) {
    return items
  }

  return items.filter((item) => {
    const doesTitleMatchFilter = item?.title
      ?.toLowerCase()
      .includes(filterValue.toLowerCase())
    if (doesTitleMatchFilter) {
      return true
    }

    const doesChildMatchFilter =
      item.routes && getFilteredMenuItems(item.routes, filterValue).length
    if (doesChildMatchFilter) {
      return true
    }

    return false
  })
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems, basePaths }) => {
  const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
  const { itemsWithMetadata } = useMemo(
    () => addActiveStateMetadata(currentPath, menuItems),
    [currentPath, menuItems]
  )
  const [filterValue, setFilterValue] = useState('')
  const filteredMenuItems = getFilteredMenuItems(itemsWithMetadata, filterValue)

  return (
    <div className={s.sidebar}>
      <SidebarBackToLink />
      <SidebarFilterInput value={filterValue} onChange={setFilterValue} />
      {/* TODO: What should this title be? */}
      <SidebarNav
        title="Waypoint"
        menuItems={filteredMenuItems}
        basePaths={basePaths}
      />
    </div>
  )
}

export default Sidebar
