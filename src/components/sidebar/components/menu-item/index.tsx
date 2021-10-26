import { MenuItem } from 'components/sidebar'
import s from './style.module.css'

interface SidebarMenuItemProps {
  item: MenuItem
}

// TODO: implement submenus (ref: https://app.asana.com/0/1201010428539925/1201265683986459/f)
const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({ item }) => {
  const { divider, title, path } = item

  // TODO: remove this once `divider` isn't in the data anymore
  if (divider) {
    return null
  }

  return (
    <li className={s.sidebarMenuItem}>
      {/* TODO: conditionally render as button if submenu */}
      <a href={path}>
        <span>{title}</span>
        {/* TODO: this is for the submenu icon */}
        {/* <span></span> */}
      </a>
    </li>
  )
}

export default SidebarMenuItem
