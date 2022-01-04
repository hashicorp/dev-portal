import { MenuItem } from 'components/sidebar'
import SidebarNavMenuItem from './sidebar-nav-menu-item'
import s from './style.module.css'

const SIDEBAR_LABEL_ID = 'sidebar-label'

interface SidebarNavProps {
  menuItems: MenuItem[]
  title: string
}

const SidebarNav: React.FC<SidebarNavProps> = ({ menuItems, title }) => (
  <nav aria-labelledby={SIDEBAR_LABEL_ID} className={s.sidebarNavElement}>
    <p className={s.sidebarNavLabel} id={SIDEBAR_LABEL_ID}>
      {title}
    </p>
    <a className={s.skipToMainContent} href="#main">
      Skip to main content
    </a>
    <ul className={s.sidebarNavList}>
      {menuItems.map((item) => (
        <SidebarNavMenuItem item={item} key={item.id} />
      ))}
    </ul>
  </nav>
)

export default SidebarNav
