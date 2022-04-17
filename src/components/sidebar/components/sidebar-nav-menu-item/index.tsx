import { KeyboardEventHandler, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { IconChevronRight16 } from '@hashicorp/flight-icons/svg-react/chevron-right-16'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import isAbsoluteUrl from 'lib/is-absolute-url'
import { MenuItem } from 'components/sidebar'
import {
  SidebarHorizontalRule,
  SidebarSectionHeading,
} from 'components/sidebar/components'
import Text from 'components/text'
import { SidebarNavMenuItemProps } from './types'
import s from './sidebar-nav-menu-item.module.css'

/**
 * Handles rendering a link menu item in the Sidebar. Will automatically
 * determine whether or not the link is external to DevDot, and will render an
 * external link icon if the link is external.
 */
const SidebarNavLink = ({ item }: SidebarNavMenuItemProps) => {
  const href = item.fullPath || item.path || item.href
  const isExternal = isAbsoluteUrl(href)

  return (
    <Link href={href}>
      <a
        aria-current={item.isActive ? 'page' : undefined}
        className={s.sidebarNavMenuItem}
      >
        <Text
          asElement="span"
          className={s.navMenuItemLabel}
          dangerouslySetInnerHTML={{ __html: item.title }}
          size={200}
          weight="regular"
        />
        {isExternal && <IconExternalLink16 />}
      </a>
    </Link>
  )
}

/**
 * Handles rendering a collapsible/expandable submenu item and its child menu
 * items in the Sidebar.
 */
const SidebarNavSubmenu = ({ item }: SidebarNavMenuItemProps) => {
  const buttonRef = useRef<HTMLButtonElement>()
  const [isOpen, setIsOpen] = useState(
    item.hasActiveChild || item.hasChildrenMatchingFilter || item.matchesFilter
  )

  /**
   * Without this effect, the menu items aren't re-rerendered to be open. Seems
   * to be because the item prop sent to the component don't change. Might work
   * if we pass the props needed instead of just the item object?
   */
  useEffect(() => {
    setIsOpen(
      item.hasActiveChild ||
        item.hasChildrenMatchingFilter ||
        item.matchesFilter
    )
  }, [item.hasActiveChild, item.hasChildrenMatchingFilter, item.matchesFilter])

  const handleKeyDown: KeyboardEventHandler<HTMLUListElement> = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      setIsOpen(false)
      buttonRef.current.focus()
    }
  }

  return (
    <>
      <button
        aria-controls={item.id}
        aria-expanded={isOpen}
        className={s.sidebarNavMenuItem}
        onClick={() => setIsOpen((prevState: boolean) => !prevState)}
        ref={buttonRef}
      >
        <Text
          asElement="span"
          className={s.navMenuItemLabel}
          dangerouslySetInnerHTML={{ __html: item.title }}
          size={200}
          weight="regular"
        />
        <IconChevronRight16 />
      </button>
      <ul
        id={item.id}
        onKeyDown={handleKeyDown}
        style={{ display: isOpen ? 'block' : 'none' }}
      >
        {item.routes.map((childItem: MenuItem) => (
          <SidebarNavMenuItem item={childItem} key={childItem.id} />
        ))}
      </ul>
    </>
  )
}

/**
 * Handles conditionally rendering one of the following based on the properties
 * of the `item` passed in:
 *  - SidebarHorizontalRule
 *  - SidebarSectionHeading
 *  - SidebarNavSubmenu
 *  - SidebarNavLink
 */
const SidebarNavMenuItem = ({ item }: SidebarNavMenuItemProps) => {
  let itemContent
  if (item.divider) {
    itemContent = <SidebarHorizontalRule />
  } else if (item.heading) {
    itemContent = <SidebarSectionHeading text={item.heading} />
  } else if (item.routes) {
    itemContent = <SidebarNavSubmenu item={item} />
  } else {
    itemContent = <SidebarNavLink item={item} />
  }

  return <li id={item.id}>{itemContent}</li>
}

export default SidebarNavMenuItem
