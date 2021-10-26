import { useState } from 'react'
import { useRouter } from 'next/router'
import SidebarBackToLink from './components/sidebar-back-to-link'
import SidebarFilterInput from './components/sidebar-filter-input'
import SidebarMenuItem from './components/sidebar-menu-item'
import SidebarNav from './components/sidebar-nav'
import s from './style.module.css'

// TODO: store this in a Context that ProductChooser updates?
const product = 'waypoint'

export interface MenuItem {
  divider?: boolean
  title?: string
  path?: string
  routes?: MenuItem[]
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
  const router = useRouter()
  const [filterValue, setFilterValue] = useState('')

  const filteredMenuItems = getFilteredMenuItems(menuItems, filterValue)

  return (
    <div className={s.sidebar}>
      <SidebarBackToLink />
      <SidebarFilterInput value={filterValue} onChange={setFilterValue} />
      {/* TODO: What should this title be? */}
      <SidebarNav title="Waypoint">
        {filteredMenuItems.map((item, index) => {
          if (item.routes) {
            return null
          }

          const path = `/${product}/docs/${item.path}`
          const isActive = router.asPath === path
          return (
            <SidebarMenuItem
              isActive={isActive}
              item={{ ...item, path }}
              // TODO: come up with better alternative to index
              // eslint-disable-next-line react/no-array-index-key
              key={`sidebar-menu-item-${index}`}
            />
          )
        })}
      </SidebarNav>
    </div>
  )
}

export default Sidebar
