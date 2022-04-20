import { ReactElement, useMemo, useState } from 'react'
import useCurrentPath from 'hooks/use-current-path'
import Button from 'components/button'
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
import { IconChevronLeft16 } from '@hashicorp/flight-icons/svg-react/chevron-left-16'
import { IconChevronRight16 } from '@hashicorp/flight-icons/svg-react/chevron-right-16'
import { useDeviceSize } from 'contexts'
import { useSidebarNavData } from 'layouts/sidebar-sidecar/contexts/sidebar-nav-data'

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
  const { hasManyLevels, isFirstLevel, isMiddleLevel, setCurrentLevel } =
    useSidebarNavData()
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
  if (levelButtonProps && !isDesktop) {
    const { iconPosition, text } = levelButtonProps

    let icon
    if (iconPosition === 'leading') {
      icon = <IconChevronLeft16 />
    } else {
      icon = <IconChevronRight16 />
    }

    let backButton
    if (hasManyLevels && !isFirstLevel) {
      backButton = (
        <Button
          className={s.backButton}
          color="tertiary"
          icon={icon}
          iconPosition={iconPosition}
          text={text}
          onClick={() => setCurrentLevel((prevLevel) => prevLevel - 1)}
        />
      )
    }

    let forwardButton
    if (hasManyLevels && isFirstLevel) {
      forwardButton = (
        <Button
          className={s.forwardButton}
          color="tertiary"
          icon={icon}
          iconPosition={iconPosition}
          text={text}
          onClick={() => setCurrentLevel((prevLevel) => prevLevel + 1)}
        />
      )
    } else if (hasManyLevels && isMiddleLevel) {
      forwardButton = (
        <Button
          className={s.forwardButton}
          color="tertiary"
          icon={<IconChevronRight16 />}
          iconPosition={'trailing'}
          text="Previous"
          onClick={() => setCurrentLevel((prevLevel) => prevLevel + 1)}
        />
      )
    }

    backToElement = (
      <div className={s.mobileControls}>
        {backButton}
        {forwardButton}
      </div>
    )
  } else if (backToLinkProps) {
    const { text, href } = backToLinkProps
    backToElement = <SidebarBackToLink text={text} href={href} />
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
      {backToElement}
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
