import { KeyboardEventHandler, useRef, useState } from 'react'
import { MenuItem } from 'components/sidebar'
import useCurrentPath from 'hooks/use-current-path'
import s from './style.module.css'
import { IconChevronRight16 } from '@hashicorp/flight-icons/svg-react/chevron-right-16'

interface SidebarMenuItemProps {
  item: MenuItem
  /** Optional path strings representing the path from the root URL. */
  basePaths?: string[]
}

/**
 * Builds the path for an item based on the current page path.
 */
const getItemPath = (
  item: MenuItem,
  currentPath: string,
  basePaths
): string => {
  const currentPathSplit = currentPath.split('/')
  const currentProductSlug = basePaths ? basePaths[0] : currentPathSplit[1]
  const currentProductSubpage = basePaths ? basePaths[1] : currentPathSplit[2]
  return `/${currentProductSlug}/${currentProductSubpage}/${item.path}`
}

// TODO: use next/link
const SidebarNavLink = ({ item, basePaths }) => {
  const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })

  return (
    <li>
      <a
        aria-current={item.isActive ? 'page' : undefined}
        className={s.sidebarNavMenuItem}
        // TODO: this might break some accessible labels, probably need aria-label
        dangerouslySetInnerHTML={{ __html: item.title }}
        href={item.href || getItemPath(item, currentPath, basePaths)}
      />
    </li>
  )
}

const SidebarNavSubmenu: React.FC<SidebarMenuItemProps> = ({
  item,
  basePaths,
}) => {
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
              <SidebarNavSubmenu item={route} basePaths={basePaths} />
            ) : (
              <SidebarNavLink item={route} basePaths={basePaths} />
            )
          )}
        </ul>
      )}
    </li>
  )
}

const SidebarNavMenuItem: React.FC<SidebarMenuItemProps> = ({
  item,
  basePaths,
}) => {
  // TODO: the designs don't currently show a divider
  if (item.divider) {
    return null
  }

  if (item.routes) {
    return <SidebarNavSubmenu item={item} basePaths={basePaths} />
  }

  return <SidebarNavLink item={item} basePaths={basePaths} />
}

export default SidebarNavMenuItem
