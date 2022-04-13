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
import s from './sidebar-nav-menu-item.module.css'

interface SidebarMenuItemProps {
  item: MenuItem
}

const SidebarNavLink = ({ item }: { item: MenuItem }) => {
  const href = item.fullPath || item.href
  const isExternal = isAbsoluteUrl(href)

  return (
    <li>
      <Link href={href}>
        <a aria-current={item.isActive} className={s.sidebarNavMenuItem}>
          <span
            className={s.navMenuItemLabel}
            dangerouslySetInnerHTML={{ __html: item.title }}
          />
          {isExternal && <IconExternalLink16 />}
        </a>
      </Link>
    </li>
  )
}

const SidebarNavSubmenu: React.FC<SidebarMenuItemProps> = ({ item }) => {
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
        onClick={() => setIsOpen((prevState) => !prevState)}
        ref={buttonRef}
      >
        <span
          className={s.navMenuItemLabel}
          dangerouslySetInnerHTML={{ __html: item.title }}
        />
        <IconChevronRight16 />
      </button>
      {isOpen && (
        <ul id={item.id} onKeyDown={handleKeyDown}>
          {item.routes.map((route) =>
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

const SidebarNavMenuItem: React.FC<SidebarMenuItemProps> = ({ item }) => {
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

export { SidebarNavLink }
export default SidebarNavMenuItem
