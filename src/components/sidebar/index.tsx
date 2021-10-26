import { useState } from 'react'
import BackToLink from './components/back-to-link'
import FilterInput from './components/filter-input'
import s from './style.module.css'

const SIDEBAR_LABEL_ID = 'sidebar-label'

interface MenuItem {
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
          {filteredMenuItems.map((item, index) => {
            const { divider, title, path } = item

            // TODO: remove this once `divider` isn't in the data anymore
            if (divider) {
              return null
            }

            // TODO: implement submenus (ref: https://app.asana.com/0/1201010428539925/1201265683986459/f)
            // if (routes) { }

            return (
              <li
                className={s.sidebarMenuItem}
                // TODO: come up with better alternative to index
                // eslint-disable-next-line react/no-array-index-key
                key={`sidebar-menu-item-${index}`}
              >
                {/* TODO: conditionally render as button if submenu */}
                <a href={path}>
                  <span>{title}</span>
                  {/* TODO: this is for the submenu icon */}
                  {/* <span></span> */}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar
