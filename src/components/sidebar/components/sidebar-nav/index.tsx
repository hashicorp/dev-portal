import { MenuItem } from 'components/sidebar'
import SidebarNavMenuItem from './sidebar-nav-menu-item'
import s from './style.module.css'

const SIDEBAR_LABEL_ID = 'sidebar-label'

interface SidebarNavProps {
  menuItems: MenuItem[]
  title: string
}

const SidebarNav: React.FC<SidebarNavProps> = ({ menuItems, title }) => {
  return (
    <nav aria-labelledby={SIDEBAR_LABEL_ID}>
      <p className={s.sidebarNavLabel} id={SIDEBAR_LABEL_ID}>
        {title}
      </p>
      <ul className={s.sidebarNavList} role="menubar">
        {menuItems.map((item, index) => (
          <SidebarNavMenuItem
            item={item}
            // TODO: come up with better alternative to index
            // eslint-disable-next-line react/no-array-index-key
            key={`sidebar-nav-menu-item-${index}`}
            // TODO: still thinking about this approach
            tabIndex={index === 0 ? 0 : -1}
          />
        ))}
      </ul>
    </nav>
  )
}

export default SidebarNav
