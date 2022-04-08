import { KeyboardEventHandler, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import classNames from 'classnames'
import { IconChevronRight16 } from '@hashicorp/flight-icons/svg-react/chevron-right-16'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import MaybeInternalLink from 'components/maybe-internal-link'
import { MenuItem } from 'components/sidebar'
import Text from 'components/text'
import s from './sidebar-nav-menu-item.module.css'

interface SidebarMenuItemProps {
  item: MenuItem
}

const SidebarNavLink = ({ item }) => {
  if (item.fullPath) {
    return (
      <li>
        <Link href={item.fullPath}>
          <a
            aria-current={item.isActive ? 'page' : undefined}
            className={s.sidebarNavMenuItem}
            // TODO: this might break some accessible labels, probably need aria-label
            dangerouslySetInnerHTML={{ __html: item.title }}
          />
        </Link>
      </li>
    )
  }

  return (
    <li>
      <MaybeInternalLink
        aria-current={item.isActive ? 'page' : undefined}
        className={s.sidebarNavMenuItem}
        href={item.href}
      >
        <span
          className={s.navMenuItemLabel}
          // TODO: this might break some accessible labels, probably need aria-label
          dangerouslySetInnerHTML={{ __html: item.title }}
        />
        <IconExternalLink16 />
      </MaybeInternalLink>
    </li>
  )
}

/**
 * TODO: the `isOpen` boolean is getting a little long, will refactor after some
 * more thinking on it.
 */
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

function HorizontalRule({ className }: { className?: string }) {
  return <hr className={classNames(s.divider, className)} />
}

const SidebarNavMenuItem: React.FC<SidebarMenuItemProps> = ({ item }) => {
  if (item.divider) {
    return <HorizontalRule />
  }

  // TODO: 2022-01-03: designs show a heading on the product home page,
  // TODO: eg /waypoint, so adding this type in.
  if (item.heading) {
    return (
      <Text className={s.heading} size={200} weight="semibold">
        {item.heading}
      </Text>
    )
  }

  if (item.routes) {
    return <SidebarNavSubmenu item={item} />
  }

  return <SidebarNavLink item={item} />
}

export { HorizontalRule, SidebarNavLink }
export default SidebarNavMenuItem
