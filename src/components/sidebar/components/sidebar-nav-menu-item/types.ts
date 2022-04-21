import { MenuItem } from 'components/sidebar'

interface SidebarNavMenuItemProps {
  item: MenuItem
}

type SupportedIconName = 'home' | 'vault' | 'waypoint'
interface SidebarNavLinkItem extends MenuItem {
  leadingIconName?: SupportedIconName
}

interface SidebarNavLinkItemProps {
  item: SidebarNavLinkItem
}

export type {
  SidebarNavLinkItemProps,
  SidebarNavMenuItemProps,
  SupportedIconName,
}
