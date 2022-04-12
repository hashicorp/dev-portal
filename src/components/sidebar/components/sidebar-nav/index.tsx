import { MenuItem } from 'components/sidebar'
import SidebarNavMenuItem from './sidebar-nav-menu-item'
import SkipToMainContent from './skip-to-main-content'
import s from './sidebar-nav.module.css'

const SIDEBAR_LABEL_ID = 'sidebar-label'

interface SidebarNavProps {
  menuItems: MenuItem[]
  title: string
}

const SidebarNav = ({ menuItems, title }: SidebarNavProps) => (
  <nav aria-labelledby={SIDEBAR_LABEL_ID} className={s.nav}>
    <h2 className={s.title} id={SIDEBAR_LABEL_ID}>
      {title}
    </h2>
    <SkipToMainContent />
    <ul className={s.navList}>
      {menuItems.map((item) => (
        <SidebarNavMenuItem item={item} key={item.id} />
      ))}
    </ul>
  </nav>
)

export default SidebarNav
