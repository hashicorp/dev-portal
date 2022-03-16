import { SidebarProps } from 'components/sidebar'
import SidebarNav from 'components/sidebar/components/sidebar-nav'

// @TODO match sidebar to spec
export function TutorialSidebar({
  title,
  menuItems,
}: Pick<
  SidebarProps,
  'title' | 'menuItems' | 'backToLinkProps'
>): React.ReactElement {
  return <SidebarNav title={title} menuItems={menuItems} />
}
