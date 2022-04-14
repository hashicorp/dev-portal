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
const SidebarNavLink = ({ item }: { item: MenuItem }) => {
  const href = item.fullPath || item.href
  const isExternal = isAbsoluteUrl(href)

  return (
    <li>
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
    </li>
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
    <li>
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
      {isOpen && (
        <ul id={item.id} onKeyDown={handleKeyDown}>
          {item.routes.map((route: MenuItem) =>
            route.routes ? (
              <SidebarNavSubmenu item={route} />
            ) : (
              <SidebarNavLink item={route} />
            )
          )}
        </ul>
      )}
    </li>
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
  if (item.divider) {
    return <SidebarHorizontalRule />
  }

  if (item.heading) {
    return <SidebarSectionHeading text={item.heading} />
  }

  if (item.routes) {
    return <SidebarNavSubmenu item={item} />
  }

  return <SidebarNavLink item={item} />
}

export default SidebarNavMenuItem
