import { MenuItem } from 'components/sidebar'
import SidebarNavMenuItem from './sidebar-nav-menu-item'
import s from './style.module.css'

const SIDEBAR_LABEL_ID = 'sidebar-label'

interface SidebarNavProps {
  menuItems: MenuItem[]
  title: string
  /** Optional path strings representing the path from the root URL. */
  basePaths?: string[]
}

const SidebarNav: React.FC<SidebarNavProps> = ({
  menuItems,
  title,
  basePaths,
}) => (
  <nav aria-labelledby={SIDEBAR_LABEL_ID}>
    <p className={s.sidebarNavLabel} id={SIDEBAR_LABEL_ID}>
      {title}
    </p>
    <a className={s.skipToMainContent} href="#main">
      Skip to main content
    </a>
    <ul className={s.sidebarNavList}>
      {menuItems.map((item, index) => {
        return (
          <SidebarNavMenuItem
            item={item}
            // TODO: use item.id when it has been added to the metadata (see above)
            // eslint-disable-next-line react/no-array-index-key
            key={`sidebar-nav-menu-item-${index}`}
            basePaths={basePaths}
          />
        )
      })}
    </ul>
  </nav>
)

export default SidebarNav
