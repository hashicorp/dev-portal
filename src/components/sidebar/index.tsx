// Third-party imports
import { ReactElement, useMemo, useState } from 'react'
import classNames from 'classnames'

// Global imports
import useCurrentPath from 'hooks/use-current-path'
import { useSidebarNavData } from 'layouts/sidebar-sidecar/contexts/sidebar-nav-data'
import {
  SidebarHorizontalRule,
  SidebarNavLinkItem,
  SidebarNavMenuItem,
  SidebarSkipToMainContent,
  SidebarTitleHeading,
} from 'components/sidebar/components'

// Local imports
import { FilteredNavItem, MenuItem, SidebarProps } from './types'
import { addNavItemMetaData, getFilteredNavItems } from './helpers'
import SidebarBackToLink from './components/sidebar-back-to-link'
import SidebarFilterInput from './components/sidebar-filter-input'
import SidebarMobileControls from './components/sidebar-mobile-controls'
import s from './sidebar.module.css'

const SIDEBAR_LABEL_ID = 'sidebar-label'

const RESOURCES_NAV_ITEMS = [
  { heading: 'Resources' },
  { title: 'All Tutorials', href: 'https://learn.hashicorp.com/search' },
  {
    title: 'Community Forum',
    href: 'https://discuss.hashicorp.com/',
  },
  {
    title: 'Support',
    href: 'https://www.hashicorp.com/customer-success',
  },
  { title: 'GitHub', href: 'https://github.com/hashicorp/' },
]

const Sidebar = ({
  backToLinkProps,
  children,
  levelButtonProps,
  menuItems,
  overviewItemHref,
  showFilterInput = true,
  title,
  visuallyHideTitle = false,
}: SidebarProps): ReactElement => {
  const { shouldRenderMobileControls } = useSidebarNavData()
  const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
  const [filterValue, setFilterValue] = useState('')
  const { itemsWithMetadata } = useMemo(
    () => addNavItemMetaData(currentPath, menuItems),
    [currentPath, menuItems]
  )

  let backToElement
  if (shouldRenderMobileControls && levelButtonProps) {
    backToElement = (
      <SidebarMobileControls
        levelUpButtonText={levelButtonProps.levelUpButtonText}
        levelDownButtonText={levelButtonProps.levelDownButtonText}
      />
    )
  } else if (backToLinkProps) {
    const { text, href } = backToLinkProps
    backToElement = (
      <div className={s.backToLinkWrapper}>
        <SidebarBackToLink text={text} href={href} />
      </div>
    )
  }

  let sidebarFilterInput
  if (showFilterInput) {
    sidebarFilterInput = (
      <div
        className={classNames(s.filterInputWrapper, {
          [s['filerInputWrapper--mobile']]: shouldRenderMobileControls,
        })}
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
        {filteredMenuItems.map((item: FilteredNavItem, index) => (
          <SidebarNavMenuItem
            item={item}
            key={item.id ?? item.title ?? index}
          />
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
        <SidebarHorizontalRule />
        <ul className={s.navList}>
          {RESOURCES_NAV_ITEMS.map((item, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <SidebarNavMenuItem item={item} key={index} />
          ))}
        </ul>
      </nav>
    </div>
  )
}

export type { MenuItem, SidebarProps }
export default Sidebar
