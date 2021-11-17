import { MenuItem } from 'components/sidebar'
import SidebarNavMenuItem from './sidebar-nav-menu-item'
import s from './style.module.css'

const SIDEBAR_LABEL_ID = 'sidebar-label'

interface SidebarNavProps {
  menuItems: MenuItem[]
  title: string
}

// TODO: store this in a Context that ProductChooser updates?
const product = 'waypoint'

const SidebarNav: React.FC<SidebarNavProps> = ({ menuItems, title }) => {
  return (
    <nav aria-labelledby={SIDEBAR_LABEL_ID}>
      <p className={s.sidebarNavLabel} id={SIDEBAR_LABEL_ID}>
        {title}
      </p>
      <ul className={s.sidebarNavList} role="menubar">
        {menuItems.map((item, index) => {
          const path = `/${product}/docs/${item.path}`
          return (
            <SidebarNavMenuItem
              item={{ ...item, path }}
              // TODO: come up with better alternative to index
              // eslint-disable-next-line react/no-array-index-key
              key={`sidebar-nav-menu-item-${index}`}
            />
          )
        })}
      </ul>
    </nav>
  )
}

export default SidebarNav
