import { useState } from 'react'
import { useRouter } from 'next/router'
import { MenuItem } from 'components/sidebar'
import s from './style.module.css'
import { IconChevronRight16 } from '@hashicorp/flight-icons/svg-react/chevron-right-16'

// TODO: store this in a Context that ProductChooser updates?
const PRODUCT = 'waypoint'

interface SidebarMenuItemProps {
  item: MenuItem
  tabIndex: 0 | -1
}

const getPath = (item: MenuItem): string => `/${PRODUCT}/docs/${item.path}`

const SidebarNavSubmenu: React.FC<{
  currentPath: string
  item: MenuItem
  tabIndex: 0 | -1
}> = ({ currentPath, item, tabIndex }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <li role="none">
      <button
        aria-expanded={isOpen}
        aria-haspopup
        className={s.sidebarNavMenuItem}
        onClick={() => setIsOpen((prevState) => !prevState)}
        role="menuitem"
        tabIndex={tabIndex}
      >
        <span>{item.title}</span>
        <IconChevronRight16 />
      </button>
      {isOpen && (
        <ul role="menu">
          {item.routes.map((route) =>
            route.routes ? (
              <SidebarNavSubmenu
                currentPath={currentPath}
                item={route}
                tabIndex={tabIndex}
              />
            ) : (
              <li role="none">
                <a
                  aria-current={
                    currentPath.endsWith(route.path) ? 'page' : undefined
                  }
                  className={s.sidebarNavMenuItem}
                  // TODO: this might break some accessible labels, probably need aria-label
                  dangerouslySetInnerHTML={{ __html: route.title }}
                  href={getPath(route)}
                  role="menuitem"
                  tabIndex={tabIndex}
                />
              </li>
            )
          )}
        </ul>
      )}
    </li>
  )
}

// TODO: implement submenus (ref: https://app.asana.com/0/1201010428539925/1201265683986459/f)
const SidebarNavMenuItem: React.FC<SidebarMenuItemProps> = ({
  item,
  tabIndex,
}) => {
  const router = useRouter()
  const currentPath = router.asPath

  // TODO: remove this once `divider` isn't in the data anymore
  // Design decided to remove the dividers in the new sidebar.
  if (item.divider) {
    return null
  }

  if (item.routes) {
    return (
      <SidebarNavSubmenu
        currentPath={currentPath}
        item={item}
        tabIndex={tabIndex}
      />
    )
  }

  const isActive = currentPath.endsWith(item.path)
  return (
    <li role="none">
      <a
        aria-current={isActive ? 'page' : undefined}
        className={s.sidebarNavMenuItem}
        // TODO: this might break some accessible labels, probably need aria-label
        dangerouslySetInnerHTML={{ __html: item.title }}
        href={getPath(item)}
        role="menuitem"
        tabIndex={tabIndex}
      />
    </li>
  )
}

export default SidebarNavMenuItem
