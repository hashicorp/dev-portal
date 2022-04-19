import { MenuItem } from 'components/sidebar'
import {
  SidebarNavMenuItem,
  SidebarSkipToMainContent,
  SidebarTitleHeading,
} from 'components/sidebar/components'
import s from './sidebar-nav.module.css'

const SIDEBAR_LABEL_ID = 'sidebar-label'

interface SidebarNavProps {
  menuItems: MenuItem[]
  title: string
}

const SidebarNav = ({ menuItems, title }: SidebarNavProps) => (
  <nav aria-labelledby={SIDEBAR_LABEL_ID} className={s.nav}>
    <SidebarTitleHeading text={title} id={SIDEBAR_LABEL_ID} />
    <SidebarSkipToMainContent />
    <ul className={s.navList}>
      {menuItems.map((item) => (
        <SidebarNavMenuItem item={item} key={item.id} />
      ))}
    </ul>
  </nav>
)

export default SidebarNav
