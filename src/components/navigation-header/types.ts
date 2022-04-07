import { ProductSlug } from 'types/products'

type SupportedIcon = 'docs' | 'home' | 'terminalScreen' | 'tools'

type NavigationHeaderIcon = ProductSlug | SupportedIcon

interface NavigationHeaderItem {
  icon: NavigationHeaderIcon
  label: string
  path: string
}

interface NavigationHeaderDropdownMenuProps {
  itemGroups: NavigationHeaderItem[][]
  label: string
}

export type {
  NavigationHeaderDropdownMenuProps,
  NavigationHeaderIcon,
  NavigationHeaderItem,
  SupportedIcon,
}
