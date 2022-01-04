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
  fullPath?: string
  hasActiveChild?: boolean
  hasChildrenMatchingFilter?: boolean
  href?: string
  id?: string
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
  /** Optional { text, url } to use for the "← Back to..." link at the top of the sidebar */
  backToLink?: {
    text: string
    url: string
  }
}

const addItemMetadata = (
  currentPath: string,
  items: MenuItem[]
): { foundActiveItem: boolean; itemsWithMetadata: MenuItem[] } => {
  const currentPathSplit = currentPath.split('/')
  const currentProductSlug = currentPathSplit[1]
  const currentProductSubpage = currentPathSplit[2]

  let foundActiveItem = false

  const itemsWithMetadata = items.map((item) => {
    const itemCopy = { ...item }

    if (item.divider) {
      return itemCopy
    }

    if (foundActiveItem) {
      itemCopy[item.routes ? 'hasActiveChild' : 'isActive'] = false
    }

    if (item.routes) {
      const result = addItemMetadata(currentPath, item.routes)
      foundActiveItem = result.foundActiveItem
      itemCopy.routes = result.itemsWithMetadata
      itemCopy.hasActiveChild = result.foundActiveItem
      itemCopy.id = `submenu-${itemCopy.title
        .replace(/( |\.)/g, '-')
        .replace(/-+/g, '-')
        .toLowerCase()}`
    } else if (item.path) {
      foundActiveItem = currentPath.endsWith(item.path)
      itemCopy.isActive = foundActiveItem
      itemCopy.fullPath = `/${currentProductSlug}/${currentProductSubpage}/${item.path}`
      itemCopy.id = `menu-item-${itemCopy.fullPath
        .replace(/\//g, '-')
        .toLowerCase()}`.replace(/-+/g, '-')
    } else if (item.href) {
      itemCopy.id = `external-url-${itemCopy.title
        .replace(/( |\.)/g, '-')
        .replace(/-+/g, '-')
        .toLowerCase()}`
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
 * */
const getFilteredMenuItems = (items: MenuItem[], filterValue: string) => {
  if (!filterValue) {
    return items
  }

  const filteredItems = []

  items.forEach((item) => {
    const itemCopy = { ...item }
    let matchingChildren: MenuItem[]
    let hasChildrenMatchingFilter = false

    if (item.routes) {
      matchingChildren = getFilteredMenuItems(item.routes, filterValue)
      hasChildrenMatchingFilter = matchingChildren.length > 0
      itemCopy.hasChildrenMatchingFilter = hasChildrenMatchingFilter
      itemCopy.routes = matchingChildren
    }

    const doesTitleMatchFilter = item?.title
      ?.toLowerCase()
      .includes(filterValue.toLowerCase())
    if (doesTitleMatchFilter || hasChildrenMatchingFilter) {
      filteredItems.push(itemCopy)
    }
  })

  return filteredItems
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems, backToLink = {} }) => {
  const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
  const { itemsWithMetadata } = useMemo(
    () => addItemMetadata(currentPath, menuItems),
    [currentPath, menuItems]
  )
  const [filterValue, setFilterValue] = useState('')
  const filteredMenuItems = getFilteredMenuItems(itemsWithMetadata, filterValue)

  return (
    <div className={s.sidebar}>
      <SidebarBackToLink text={backToLink.text} url={backToLink.url} />
      <SidebarFilterInput value={filterValue} onChange={setFilterValue} />
      {/* TODO: What should this title be? */}
      <SidebarNav title="Waypoint" menuItems={filteredMenuItems} />
    </div>
  )
}

export default Sidebar
