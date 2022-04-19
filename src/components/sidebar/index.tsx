import { ReactElement, useMemo, useState } from 'react'
import useCurrentPath from 'hooks/use-current-path'
import SidebarBackToLink from './components/sidebar-back-to-link'
import SidebarFilterInput from './components/sidebar-filter-input'
import {
  SidebarNavLinkItem,
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
  children,
  menuItems,
  overviewItemHref,
  showFilterInput = true,
  title,
  visuallyHideTitle = false,
}: SidebarProps): ReactElement => {
  const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
  const [filterValue, setFilterValue] = useState('')
  const { itemsWithMetadata } = useMemo(
    () => addNavItemMetaData(currentPath, menuItems),
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
    const filteredMenuItems = getFilteredNavItems(
      itemsWithMetadata,
      filterValue
    )
    sidebarContent = (
      <ul className={s.navList}>
        {filteredMenuItems.map((item: FilteredNavItem) => (
          <SidebarNavMenuItem item={item} key={item.id} />
        ))}
      </ul>
    )
  }

  let overviewItem
  if (overviewItemHref) {
    overviewItem = (
      <SidebarNavLinkItem
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
        <div className={visuallyHideTitle ? 'g-screen-reader-only' : undefined}>
          <SidebarTitleHeading text={title} id={SIDEBAR_LABEL_ID} />
        </div>
        <SidebarSkipToMainContent />
        {overviewItem}
        {sidebarContent}
      </nav>
    </div>
  )
}

export type { MenuItem, SidebarProps }
export default Sidebar
