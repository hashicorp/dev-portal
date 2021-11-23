import { useMemo, useState } from 'react'
import { useRouter } from 'next/router'
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
}

interface SidebarProps {
  menuItems: MenuItem[]
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

// TODO: this might be a helpful to abstract as a util? The name feels looong
const getCurrentPathWithoutParamsOrAnchors = (path: string): string => {
  const matches = path.match(/.+?(?=(#|\?))/)
  if (matches) {
    return matches[0]
  }

  return path
}

// TODO: will need to recursively search submenus when they're implemented
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

const Sidebar: React.FC<SidebarProps> = ({ menuItems }) => {
  const router = useRouter()
  const currentPath = getCurrentPathWithoutParamsOrAnchors(router.asPath)
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
      <SidebarNav title="Waypoint" menuItems={filteredMenuItems} />
    </div>
  )
}

export default Sidebar
