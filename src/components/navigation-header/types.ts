import { ProductSlug } from 'types/products'

type SupportedIcon = 'docs' | 'home' | 'terminalScreen' | 'tools'

type NavigationHeaderIcon = ProductSlug | SupportedIcon

interface NewNavigationHeaderItem {
  icon: NavigationHeaderIcon
  label: string
  path: string
}

interface NavigationHeaderItem {
  id: string
  label: string
  path: string
}

interface NavigationHeaderDropdownMenuProps {
  itemGroups: NewNavigationHeaderItem[][]
  label: string
}

export type {
  NavigationHeaderDropdownMenuProps,
  NavigationHeaderIcon,
  NavigationHeaderItem,
  NewNavigationHeaderItem,
  SupportedIcon,
}
