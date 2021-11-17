import { useState } from 'react'
import { useRouter } from 'next/router'
import { MenuItem } from 'components/sidebar'
import s from './style.module.css'

interface SidebarMenuItemProps {
  item: MenuItem
}

const SidebarNavSubmenu: React.FC<{ currentPath: string; item: MenuItem }> = ({
  currentPath,
  item,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <li role="none">
      <button
        aria-expanded={isOpen}
        aria-haspopup
        onClick={() => setIsOpen((prevState) => !prevState)}
        role="menuitem"
        style={{ display: 'block' }}
      >
        {item.title}
      </button>
      {isOpen && (
        <ul role="menu">
          {item.routes.map((route) =>
            route.routes ? (
              <SidebarNavSubmenu currentPath={currentPath} item={route} />
            ) : (
              <li role="none">
                <a
                  aria-current={
                    currentPath.endsWith(route.path) ? 'page' : undefined
                  }
                  role="menuitem"
                  className={s.sidebarLink}
                  href={route.path}
                  dangerouslySetInnerHTML={{ __html: route.title }}
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
const SidebarNavMenuItem: React.FC<SidebarMenuItemProps> = ({ item }) => {
  const router = useRouter()
  const currentPath = router.asPath

  // TODO: remove this once `divider` isn't in the data anymore
  // Design decided to remove the dividers in the new sidebar.
  if (item.divider) {
    return null
  }

  const renderMenuItem = () => {
    if (item.routes) {
      return <SidebarNavSubmenu currentPath={currentPath} item={item} />
    }

    const isActive = currentPath.endsWith(item.path)
    return (
      <a
        aria-current={isActive ? 'page' : undefined}
        role="menuitem"
        className={s.sidebarLink}
        href={item.path}
      >
        {item.title}
      </a>
    )
  }

  return <li>{renderMenuItem()}</li>
}

export default SidebarNavMenuItem
