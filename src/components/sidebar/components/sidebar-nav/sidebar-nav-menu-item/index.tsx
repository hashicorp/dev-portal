import { KeyboardEventHandler, useRef, useState } from 'react'
import { MenuItem } from 'components/sidebar'
import useCurrentPath from 'hooks/use-current-path'
import s from './style.module.css'
import { IconChevronRight16 } from '@hashicorp/flight-icons/svg-react/chevron-right-16'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import MaybeInternalLink from 'components/maybe-internal-link'

interface SidebarMenuItemProps {
  item: MenuItem
}

/**
 * Builds the path for an item based on the current page path.
 */
const getItemPath = (item: MenuItem, currentPath: string): string => {
  const currentPathSplit = currentPath.split('/')
  const currentProductSlug = currentPathSplit[1]
  const currentProductSubpage = currentPathSplit[2]
  return `/${currentProductSlug}/${currentProductSubpage}/${item.path}`
}

// TODO: use next/link
const SidebarNavLink = ({ item }) => {
  const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })

  return (
    <li>
      <MaybeInternalLink
        aria-current={item.isActive ? 'page' : undefined}
        className={s.sidebarNavMenuItem}
        // TODO: this might break some accessible labels, probably need aria-label
        href={item.href || getItemPath(item, currentPath)}
        target={item._demoExternalLink ? '_blank' : undefined}
      >
        <span dangerouslySetInnerHTML={{ __html: item.title }} />
        {item._demoExternalLink && <IconExternalLink16 />}
      </MaybeInternalLink>
    </li>
  )
}

const SidebarNavSubmenu: React.FC<SidebarMenuItemProps> = ({ item }) => {
  const buttonRef = useRef<HTMLButtonElement>()
  const [isOpen, setIsOpen] = useState(item.hasActiveChild)

  const handleKeyDown: KeyboardEventHandler<HTMLUListElement> = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      setIsOpen(false)
      buttonRef.current.focus()
    }
  }

  /**
   * TODO: after ids are generated in sidebar-nav, set:
   *   - the <ul> id attribute based on the item.id
   *   - the <button> aria-controls attribute to be the <ul> id
   */
  return (
    <li>
      <button
        aria-expanded={isOpen}
        className={s.sidebarNavMenuItem}
        onClick={() => setIsOpen((prevState) => !prevState)}
        ref={buttonRef}
      >
        <span>{item.title}</span>
        <IconChevronRight16 />
      </button>
      {isOpen && (
        <ul onKeyDown={handleKeyDown}>
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
  // TODO: the designs don't currently show a divider
  // TODO: Update 2022-01-03: product home page, eg /waypoint, does
  // TODO: show divider. Including a basic implementation for now,
  // TODO: this is something we likely need to revisit with design.
  if (item.divider) {
    return <hr className={s.divider} />
  }

  // TODO: 2022-01-03: designs show a heading on the product home page,
  // TODO: eg /waypoint, so adding this type in.
  if (item.heading) {
    return <p className={s.heading}>{item.heading}</p>
  }

  if (item.routes) {
    return <SidebarNavSubmenu item={item} />
  }

  return <SidebarNavLink item={item} />
}

export default SidebarNavMenuItem
