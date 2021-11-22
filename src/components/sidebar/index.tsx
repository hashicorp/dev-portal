import { useState } from 'react'
import SidebarBackToLink from './components/sidebar-back-to-link'
import SidebarFilterInput from './components/sidebar-filter-input'
import SidebarNav from './components/sidebar-nav'
import s from './style.module.css'

/**
 *
 * For reference: this is also defined in react-components/docs-sidenav:
 * https://github.com/hashicorp/react-components/blob/main/packages/docs-sidenav/types.ts
 *
 */
export interface MenuItem {
  divider?: boolean
  hasActiveChild?: boolean
  href?: string
  isActive?: boolean
  path?: string
  routes?: MenuItem[]
  title?: string
}

interface SidebarProps {
  menuItems: MenuItem[]
}

// TODO: will need to recursively search submenus when they're implemented
const getFilteredMenuItems = (items: MenuItem[], filterValue: string) => {
  if (!filterValue) {
    return items
  }

  return items.filter((item) =>
    item?.title?.toLowerCase().includes(filterValue.toLowerCase())
  )
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems }) => {
  const [filterValue, setFilterValue] = useState('')
  const filteredMenuItems = getFilteredMenuItems(menuItems, filterValue)

  return (
    <div className={s.sidebar}>
      <SidebarBackToLink />
      <SidebarFilterInput value={filterValue} onChange={setFilterValue} />
      {/* TODO: What should this title be? */}
      <SidebarNav title="Waypoint" menuItems={filteredMenuItems} />
    </div>
  )
}

export default Sidebar
