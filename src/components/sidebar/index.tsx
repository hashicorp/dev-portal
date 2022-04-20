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
import classNames from 'classnames'

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
  const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
  const [filterValue, setFilterValue] = useState('')
  const { itemsWithMetadata } = useMemo(
    () => addNavItemMetaData(currentPath, menuItems),
    [currentPath, menuItems]
  )

  let backToElement
  if (levelButtonProps) {
    const { iconPosition, onClick, text } = levelButtonProps

    let icon
    if (iconPosition === 'leading') {
      icon = <IconChevronLeft16 />
    } else {
      icon = <IconChevronRight16 />
    }

    backToElement = (
      <Button
        className={classNames(s.levelButton, {
          [s.levelButtonWithLeadingIcon]: iconPosition === 'leading',
          [s.levelButtonWithTrailingIcon]: iconPosition === 'trailing',
          [s.levelButtonBeforeFilterInput]: showFilterInput,
          [s.levelButtonBeforeHeading]: !showFilterInput && !visuallyHideTitle,
          [s.levelButtonBeforeNavItem]: !showFilterInput && visuallyHideTitle,
        })}
        color="tertiary"
        icon={icon}
        iconPosition={iconPosition}
        onClick={onClick}
        text={text}
      />
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
