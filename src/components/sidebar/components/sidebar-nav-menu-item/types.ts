import { IconChevronRight16 } from '@hashicorp/flight-icons/svg-react/chevron-right-16'
import Badge from 'components/badge'
import { MenuItem } from 'components/sidebar'

interface RightIconsContainerProps {
  badge?: ReturnType<typeof Badge>
  icon?: ReturnType<typeof IconChevronRight16>
}

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
  RightIconsContainerProps,
  SidebarNavLinkItemProps,
  SidebarNavMenuItemProps,
  SupportedIconName,
}
