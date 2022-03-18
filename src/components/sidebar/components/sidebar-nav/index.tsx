import { MenuItem } from 'components/sidebar'
import Text from 'components/text'
import SidebarNavMenuItem from './sidebar-nav-menu-item'
import s from './sidebar-nav.module.css'

const SIDEBAR_LABEL_ID = 'sidebar-label'

interface SidebarNavProps {
  menuItems: MenuItem[]
  title: string
}

const SidebarNav: React.FC<SidebarNavProps> = ({ menuItems, title }) => (
  <nav aria-labelledby={SIDEBAR_LABEL_ID} className={s.sidebarNavElement}>
    <Text
      className={s.sidebarNavLabel}
      id={SIDEBAR_LABEL_ID}
      size={200}
      weight="semibold"
    >
      {title}
    </Text>
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
