import s from './style.module.css'

const SIDEBAR_LABEL_ID = 'sidebar-label'

interface SidebarNavProps {
  title: string
}

const SidebarNav: React.FC<SidebarNavProps> = ({ children, title }) => (
  <nav aria-labelledby={SIDEBAR_LABEL_ID} className={s.sidebarNav}>
    <p className={s.sidebarLabel} id={SIDEBAR_LABEL_ID}>
      {title}
    </p>
    <ul className={s.sidebarMenuItemsList}>{children}</ul>
  </nav>
)

export default SidebarNav
