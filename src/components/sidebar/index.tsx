import { useState } from 'react'
import BackToLink from './components/back-to-link'
import FilterInput from './components/filter-input'
import SidebarMenuItem from './components/menu-item'
import s from './style.module.css'

const SIDEBAR_LABEL_ID = 'sidebar-label'

export interface MenuItem {
  divider?: boolean
  title?: string
  path?: string
  routes?: MenuItem[]
}

const menuItems: MenuItem[] = [
  {
    title: 'Introduction',
    path: '',
  },
  {
    title: 'Getting Started',
    path: '',
  },
  {
    title: 'Upgrading',
    path: '',
  },
  {
    divider: true,
  },
  {
    title: 'Kubernetes',
    path: '',
  },
  {
    divider: true,
  },
  {
    title: 'Projects',
    path: '',
  },
  {
    title: 'Lifecycle',
    path: '',
  },
  {
    title: 'waypoint.hcl',
    path: '',
  },
  {
    title: 'URL Service',
    path: '',
  },
  {
    title: '...',
    path: '',
  },
]

// TODO: will need to recursively search submenus
const getFilteredMenuItems = (items: MenuItem[], filterValue: string) => {
  if (!filterValue) {
    return items
  }

  return [...items].filter((item) =>
    item?.title?.toLowerCase().includes(filterValue.toLowerCase())
  )
}

const Sidebar: React.FC = () => {
  const [filterValue, setFilterValue] = useState('')

  const filteredMenuItems = getFilteredMenuItems(menuItems, filterValue)

  return (
    <div className={s.sidebar}>
      <BackToLink />
      <FilterInput value={filterValue} onChange={setFilterValue} />
      <nav aria-labelledby={SIDEBAR_LABEL_ID} className={s.sidebarNav}>
        <p className={s.sidebarLabel} id={SIDEBAR_LABEL_ID}>
          Nav title
        </p>
        <ul className={s.sidebarMenuItems}>
          {filteredMenuItems.map((item, index) => (
            <SidebarMenuItem
              item={item}
              // TODO: come up with better alternative to index
              // eslint-disable-next-line react/no-array-index-key
              key={`sidebar-menu-item-${index}`}
            />
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar
