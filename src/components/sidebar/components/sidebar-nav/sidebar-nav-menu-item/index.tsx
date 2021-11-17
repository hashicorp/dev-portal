import { useState } from 'react'
import { MenuItem } from 'components/sidebar'
import s from './style.module.css'

interface SidebarMenuItemProps {
  isActive: boolean
  item: MenuItem
}

const SidebarSubmenu: React.FC<{ item: MenuItem }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false)

  return null
}

// TODO: implement submenus (ref: https://app.asana.com/0/1201010428539925/1201265683986459/f)
const SidebarNavMenuItem: React.FC<SidebarMenuItemProps> = ({
  isActive = false,
  item,
}) => {
  // TODO: handle the case when `href` is set
  const { divider, title, path } = item

  // TODO: remove this once `divider` isn't in the data anymore
  // Design decided to remove the dividers in the new sidebar.
  if (divider) {
    return null
  }

  if (item.routes) {
    console.log(item)
    return null
  }

  return (
    <li>
      {/* TODO: conditionally render as button if submenu */}
      <a
        aria-current={isActive ? 'page' : undefined}
        role="menuitem"
        className={s.sidebarLink}
        href={path}
      >
        <span>{title}</span>
        {/* TODO: this is for the submenu icon */}
        {/* <span></span> */}
      </a>
    </li>
  )
}

export default SidebarNavMenuItem
