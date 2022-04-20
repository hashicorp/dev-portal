import { ReactElement, useMemo, useState } from 'react'
import { useDeviceSize } from 'contexts'
import useCurrentPath from 'hooks/use-current-path'
import {
  SidebarNavLinkItem,
  SidebarNavMenuItem,
  SidebarSkipToMainContent,
  SidebarTitleHeading,
} from 'components/sidebar/components'
import { FilteredNavItem, MenuItem, SidebarProps } from './types'
import { addNavItemMetaData, getFilteredNavItems } from './helpers'
import SidebarBackToLink from './components/sidebar-back-to-link'
import SidebarFilterInput from './components/sidebar-filter-input'
import SidebarMobileControls from './components/sidebar-mobile-controls'
import s from './sidebar.module.css'

const SIDEBAR_LABEL_ID = 'sidebar-label'

const Sidebar = ({
  backToLinkProps,
  levelButtonProps,
  children,
  menuItems,
  overviewItemHref,
  showFilterInput = true,
  title,
  visuallyHideTitle = false,
}: SidebarProps): ReactElement => {
  const { isDesktop } = useDeviceSize()
  const shouldRenderMobileControls = levelButtonProps && !isDesktop
  const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
  const [filterValue, setFilterValue] = useState('')
  const { itemsWithMetadata } = useMemo(
    () => addNavItemMetaData(currentPath, menuItems),
    [currentPath, menuItems]
  )

  /**
   * @TODO clean up this section, too long
   */

  let backToElement
  if (shouldRenderMobileControls) {
    backToElement = (
      <SidebarMobileControls levelButtonProps={levelButtonProps} />
    )
  } else if (backToLinkProps) {
    const { text, href } = backToLinkProps
    backToElement = (
      <div style={{ marginTop: 8 }}>
        <SidebarBackToLink text={text} href={href} />
      </div>
    )
  }

  let sidebarFilterInput
  if (showFilterInput) {
    sidebarFilterInput = (
      <div
        style={{
          marginTop: shouldRenderMobileControls ? 12 : 16,
          marginBottom: 16,
        }}
      >
        <SidebarFilterInput value={filterValue} onChange={setFilterValue} />
      </div>
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

  return (
    <div className={s.sidebar}>
      {backToElement}
      {sidebarFilterInput}
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
