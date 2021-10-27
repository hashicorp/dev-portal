import s from './style.module.css'

const SIDEBAR_LABEL_ID = 'sidebar-label'

interface SidebarNavProps {
  title: string
}

const SidebarNav: React.FC<SidebarNavProps> = ({ children, title }) => (
  <nav aria-labelledby={SIDEBAR_LABEL_ID}>
    <p className={s.sidebarNavLabel} id={SIDEBAR_LABEL_ID}>
      {title}
    </p>
    <ul className={s.sidebarNavList}>{children}</ul>
  </nav>
)

export default SidebarNav
