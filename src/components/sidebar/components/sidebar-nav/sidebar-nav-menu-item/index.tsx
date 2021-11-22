import { createRef, KeyboardEventHandler, useState } from 'react'
import { MenuItem } from 'components/sidebar'
import s from './style.module.css'
import { IconChevronRight16 } from '@hashicorp/flight-icons/svg-react/chevron-right-16'

// TODO: store this in a Context that ProductChooser updates?
const PRODUCT = 'waypoint'

interface SidebarMenuItemProps {
  currentPath: string
  item: MenuItem
}

const getPath = (item: MenuItem): string => `/${PRODUCT}/docs/${item.path}`

// TODO: use next/link
const SidebarNavLink = ({ isActive, item }) => (
  <li>
    <a
      aria-current={isActive ? 'page' : undefined}
      className={s.sidebarNavMenuItem}
      // TODO: this might break some accessible labels, probably need aria-label
      dangerouslySetInnerHTML={{ __html: item.title }}
      href={getPath(item)}
    />
  </li>
)

const SidebarNavSubmenu: React.FC<{
  currentPath: string
  item: MenuItem
}> = ({ currentPath, item }) => {
  const buttonRef = createRef<HTMLButtonElement>()
  const [isOpen, setIsOpen] = useState(item.hasActiveChild)

  const handleKeyDown: KeyboardEventHandler<HTMLUListElement> = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      setIsOpen(false)
      buttonRef.current.focus()
    }
  }

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
              <SidebarNavSubmenu currentPath={currentPath} item={route} />
            ) : (
              <SidebarNavLink
                isActive={currentPath.endsWith(route.path)}
                item={route}
              />
            )
          )}
        </ul>
      )}
    </li>
  )
}

const SidebarNavMenuItem: React.FC<SidebarMenuItemProps> = ({
  currentPath,
  item,
}) => {
  // TODO: the designs don't currently show a divider
  if (item.divider) {
    return null
  }

  if (item.routes) {
    return <SidebarNavSubmenu currentPath={currentPath} item={item} />
  }

  const isActive = currentPath.endsWith(item.path)
  return <SidebarNavLink isActive={isActive} item={item} />
}

export default SidebarNavMenuItem
