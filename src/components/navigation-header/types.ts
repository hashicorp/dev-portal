import { ReactElement } from 'react'
import { ProductSlug } from 'types/products'

type SupportedIcon = 'box' | 'docs' | 'home' | 'terminalScreen' | 'tools'

type NavigationHeaderIcon = ProductSlug | SupportedIcon

interface NavigationHeaderItem {
  icon: NavigationHeaderIcon
  label: string
  path: string
}

interface NavigationHeaderItemGroup {
  label?: string
  items: NavigationHeaderItem[]
}

interface NavigationHeaderDropdownMenuProps {
  ariaLabel?: string
  buttonClassName?: string
  dropdownClassName?: string
  itemGroups: NavigationHeaderItemGroup[]
  label?: string
  leadingIcon?: ReactElement
}

export type {
  NavigationHeaderDropdownMenuProps,
  NavigationHeaderIcon,
  NavigationHeaderItem,
  NavigationHeaderItemGroup,
  SupportedIcon,
}
