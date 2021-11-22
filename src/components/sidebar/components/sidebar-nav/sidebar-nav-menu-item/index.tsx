import { createRef, KeyboardEventHandler, useState } from 'react'
import { MenuItem } from 'components/sidebar'
import s from './style.module.css'
import { IconChevronRight16 } from '@hashicorp/flight-icons/svg-react/chevron-right-16'

// TODO: store this in a Context that ProductChooser updates?
const PRODUCT = 'waypoint'

interface SidebarMenuItemProps {
  item: MenuItem
}

const getPath = (item: MenuItem): string => `/${PRODUCT}/docs/${item.path}`

// TODO: use next/link
const SidebarNavLink = ({ item }) => (
  <li>
    <a
      aria-current={item.isActive ? 'page' : undefined}
      className={s.sidebarNavMenuItem}
      // TODO: this might break some accessible labels, probably need aria-label
      dangerouslySetInnerHTML={{ __html: item.title }}
      href={item.href || getPath(item)}
    />
  </li>
)

const SidebarNavSubmenu: React.FC<{
  item: MenuItem
}> = ({ item }) => {
  const buttonRef = createRef<HTMLButtonElement>()
  const [isOpen, setIsOpen] = useState(item.hasActiveChild)

  const handleKeyDown: KeyboardEventHandler<HTMLUListElement> = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
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
  if (item.divider) {
    return null
  }

  if (item.routes) {
    return <SidebarNavSubmenu item={item} />
  }

  return <SidebarNavLink item={item} />
}

export default SidebarNavMenuItem
