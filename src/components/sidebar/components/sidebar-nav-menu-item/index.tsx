import {
  KeyboardEventHandler,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react'
import Link from 'next/link'
import { IconHome16 } from '@hashicorp/flight-icons/svg-react/home-16'
import { IconChevronRight16 } from '@hashicorp/flight-icons/svg-react/chevron-right-16'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import isAbsoluteUrl from 'lib/is-absolute-url'
import { MenuItem } from 'components/sidebar'
import ProductIcon from 'components/product-icon'
import {
  SidebarHorizontalRule,
  SidebarSectionHeading,
} from 'components/sidebar/components'
import Text from 'components/text'
import {
  SidebarNavLinkItemProps,
  SidebarNavMenuItemProps,
  SupportedIconName,
} from './types'
import s from './sidebar-nav-menu-item.module.css'

/**
 * Used for leading icon in `SidebarNavLinkItem`.
 */
const SUPPORTED_LEADING_ICONS: {
  [key in SupportedIconName]: ReactElement
} = {
  home: <IconHome16 name="home" />,
  vault: <ProductIcon productSlug="vault" />,
  waypoint: <ProductIcon productSlug="waypoint" />,
}

/**
 * Handles rendering a link menu item in the Sidebar. Will automatically
 * determine whether or not the link is external to DevDot, and will render an
 * external link icon if the link is external.
 */
const SidebarNavLinkItem = ({ item }: SidebarNavLinkItemProps) => {
  const href = item.fullPath || item.href
  const isExternal = isAbsoluteUrl(href)

  let leadingIcon
  if (item.leadingIconName) {
    const icon = SUPPORTED_LEADING_ICONS[item.leadingIconName]
    leadingIcon = <div className={s.leadingIcon}>{icon}</div>
  }

  // Conditionally determining props for the <a>
  const ariaCurrent = !isExternal && item.isActive ? 'page' : undefined
  const ariaLabel = isExternal
    ? `${item.title}. Opens in a new tab.`
    : undefined
  const className = s.sidebarNavMenuItem
  const rel = isExternal ? 'noreferrer noopener' : undefined
  const target = isExternal ? '_blank' : undefined

  return (
    <Link href={href}>
      <a
        aria-current={ariaCurrent}
        aria-label={ariaLabel}
        className={className}
        rel={rel}
        target={target}
      >
        {leadingIcon}
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
const SidebarNavSubmenuItem = ({ item }: SidebarNavMenuItemProps) => {
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
      {isOpen && (
        <ul id={item.id} onKeyDown={handleKeyDown}>
          {item.routes.map((route: MenuItem) => (
            <SidebarNavMenuItem key={route.id} item={route} />
          ))}
        </ul>
      )}
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
    itemContent = <SidebarNavSubmenuItem item={item} />
  } else {
    itemContent = <SidebarNavLinkItem item={item} />
  }

  return <li id={item.id}>{itemContent}</li>
}

export { SidebarNavLinkItem, SidebarNavSubmenuItem }
export default SidebarNavMenuItem
