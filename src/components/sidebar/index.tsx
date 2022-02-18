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
  matchesFilter?: boolean
  path?: string
  routes?: MenuItem[]
  title?: string
  /* Temporary solution to allow rendering of unlinked headings, as in designs */
  heading?: string
}

export interface SidebarProps {
  /** Optional { text, url } to use for the "← Back to..." link at the top of the sidebar */
  backToLink?: {
    text: string
    url: string
  }
  menuItems: MenuItem[]
  /** Whether or not the Sidebar should render the filter text input */
  showFilterInput?: boolean
  /** title to be shown as the title of the sidebar */
  title: string
  versionSwitcherOptions?: { label: string; value: string }[]
}

const addItemMetadata = (
  currentPath: string,
  items: MenuItem[]
): { foundActiveItem: boolean; itemsWithMetadata: MenuItem[] } => {
  let foundActiveItem = false

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

const Sidebar: React.FC<SidebarProps> = ({
  menuItems,
  backToLink = {},
  showFilterInput = true,
  title,
  versionSwitcherOptions,
}) => {
  const showVersionSwitcher =
    versionSwitcherOptions && versionSwitcherOptions.length > 0
  const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
  const { itemsWithMetadata } = useMemo(
    () => addItemMetadata(currentPath, menuItems),
    [currentPath, menuItems]
  )
  const [filterValue, setFilterValue] = useState('')
  const filteredMenuItems = getFilteredMenuItems(itemsWithMetadata, filterValue)

  // TODO: Should also be based off of the current URL
  const [selectedVersion, setSelectedVersion] = useState(
    showVersionSwitcher ? versionSwitcherOptions[0].value : undefined
  )

  return (
    <div className={s.sidebar}>
      <SidebarBackToLink text={backToLink.text} url={backToLink.url} />
      {showFilterInput && (
        <SidebarFilterInput value={filterValue} onChange={setFilterValue} />
      )}
      {showVersionSwitcher && (
        <select onChange={(e) => setSelectedVersion(e.target.value)}>
          {versionSwitcherOptions.map((option) => (
            <option
              key={option.value}
              selected={option.value === selectedVersion}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      )}
      <SidebarNav title={title} menuItems={filteredMenuItems} />
    </div>
  )
}

export default Sidebar
