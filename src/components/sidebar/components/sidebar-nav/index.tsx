import { MenuItem } from 'components/sidebar'
import { useRouter } from 'next/router'
import SidebarNavMenuItem from './sidebar-nav-menu-item'
import s from './style.module.css'

const SIDEBAR_LABEL_ID = 'sidebar-label'

interface SidebarNavProps {
  menuItems: MenuItem[]
  title: string
}

const addActiveStateMetadata = (currentPath: string, items: MenuItem[]) => {
  let foundActiveItem = false

  items.forEach((item) => {
    if (foundActiveItem) {
      item[item.routes ? 'hasActiveChild' : 'isActive'] = false
      return
    }

    if (item.routes) {
      foundActiveItem = addActiveStateMetadata(currentPath, item.routes)
      item.hasActiveChild = foundActiveItem
    } else {
      foundActiveItem = currentPath.endsWith(item.path)
      item.isActive = foundActiveItem
    }
  })

  return foundActiveItem
}

const SidebarNav: React.FC<SidebarNavProps> = ({ menuItems, title }) => {
  const router = useRouter()
  const currentPath = router.asPath.split('?')[0]

  addActiveStateMetadata(currentPath, menuItems)

  return (
    <nav aria-labelledby={SIDEBAR_LABEL_ID}>
      <p className={s.sidebarNavLabel} id={SIDEBAR_LABEL_ID}>
        {title}
      </p>
      <ul className={s.sidebarNavList} role="menubar">
        {menuItems.map((item, index) => (
          <SidebarNavMenuItem
            currentPath={currentPath}
            item={item}
            // TODO: come up with better alternative to index
            // eslint-disable-next-line react/no-array-index-key
            key={`sidebar-nav-menu-item-${index}`}
          />
        ))}
      </ul>
    </nav>
  )
}

export default SidebarNav
