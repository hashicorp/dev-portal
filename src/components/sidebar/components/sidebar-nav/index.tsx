import s from './style.module.css'

const SIDEBAR_LABEL_ID = 'sidebar-label'

const SidebarNav: React.FC = ({ children }) => (
  <nav aria-labelledby={SIDEBAR_LABEL_ID} className={s.sidebarNav}>
    <p className={s.sidebarLabel} id={SIDEBAR_LABEL_ID}>
      Nav title
    </p>
    <ul className={s.sidebarMenuItemsList}>{children}</ul>
  </nav>
)

export default SidebarNav
