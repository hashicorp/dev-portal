import { MenuItem } from 'components/sidebar'
import SidebarNavMenuItem from './sidebar-nav-menu-item'
import s from './style.module.css'

const SIDEBAR_LABEL_ID = 'sidebar-label'

interface SidebarNavProps {
  menuItems: MenuItem[]
  title: string
  basePath?: string
}

const SidebarNav: React.FC<SidebarNavProps> = ({
  menuItems,
  title,
  basePath,
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
        // TODO: this is stopgap solution, I think there may
        // TODO: be some benefit to passing basePath explicitly rather
        // TODO: than trying to parse it from the current route,
        // TODO: as it allows us to render the nav outside of its typical
        // TODO: location, which seems like something we'll likely do
        // TODO: for the initial launch of the /{product} home page.
        // TODO: One option, as below, is to make basePath optional,
        // TODO: and if it is present, then generate the href from the
        // TODO: basePath rather than try to determine the necessary
        // TODO: item.path prefix from the window location (as currently
        // TODO: done in getItemPath() if item.href is not present).
        const href =
          item.path && basePath ? basePath + '/' + item.path : item.href
        return (
          <SidebarNavMenuItem
            item={{ ...item, href }}
            // TODO: use item.id when it has been added to the metadata (see above)
            // eslint-disable-next-line react/no-array-index-key
            key={`sidebar-nav-menu-item-${index}`}
          />
        )
      })}
    </ul>
  </nav>
)

export default SidebarNav
