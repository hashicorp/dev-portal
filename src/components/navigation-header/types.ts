import { ProductSlug } from 'types/products'

type NavigationHeaderIcons =
  | ProductSlug
  | 'docs'
  | 'home'
  | 'terminalScreen'
  | 'tools'

interface NewNavigationHeaderItem {
  icon: NavigationHeaderIcons
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
  NavigationHeaderItem,
  NewNavigationHeaderItem,
}
