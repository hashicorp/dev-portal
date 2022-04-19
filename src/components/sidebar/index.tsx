import { ReactElement, useMemo, useState } from 'react'
import useCurrentPath from 'hooks/use-current-path'
import SidebarBackToLink from './components/sidebar-back-to-link'
import SidebarFilterInput from './components/sidebar-filter-input'
import {
  SidebarNavMenuItem,
  SidebarSkipToMainContent,
  SidebarTitleHeading,
} from 'components/sidebar/components'
import { FilteredNavItem, MenuItem, SidebarProps } from './types'
import { addNavItemMetaData, getFilteredNavItems } from './helpers'
import s from './sidebar.module.css'

const SIDEBAR_LABEL_ID = 'sidebar-label'

const Sidebar = ({
  backToLinkProps,
  menuItems,
  overviewItemHref,
  showFilterInput = true,
  title,
}: SidebarProps): ReactElement => {
  const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
  const { itemsWithMetadata } = useMemo(
    () => addNavItemMetaData(currentPath, menuItems),
    [currentPath, menuItems]
  )
  const [filterValue, setFilterValue] = useState('')
  const filteredMenuItems = getFilteredNavItems(itemsWithMetadata, filterValue)

  let backToLink
  if (backToLinkProps) {
    const { text, url } = backToLinkProps
    backToLink = <SidebarBackToLink text={text} url={url} />
  }

  let overviewItem
  if (overviewItemHref) {
    overviewItem = (
      <SidebarNavMenuItem
        item={{
          href: overviewItemHref,
          title: 'Overview',
          isActive: overviewItemHref === currentPath,
        }}
      />
    )
  }

  return (
    <div className={s.sidebar}>
      {backToLink}
      {showFilterInput && (
        <SidebarFilterInput value={filterValue} onChange={setFilterValue} />
      )}
      <nav aria-labelledby={SIDEBAR_LABEL_ID} className={s.nav}>
        <SidebarTitleHeading text={title} id={SIDEBAR_LABEL_ID} />
        <SidebarSkipToMainContent />
        <ul className={s.navList}>
          {overviewItem}
          {filteredMenuItems.map((item: FilteredNavItem) => (
            <SidebarNavMenuItem item={item} key={item.id} />
          ))}
        </ul>
      </nav>
    </div>
  )
}

export type { MenuItem, SidebarProps }
export default Sidebar
