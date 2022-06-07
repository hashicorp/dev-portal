import { ReactElement } from 'react'
import { ProductSlug } from 'types/products'

type SupportedIcon = 'plug' | 'docs' | 'home' | 'terminalScreen' | 'tools'

type NavigationHeaderIcon = ProductSlug | SupportedIcon

interface NavigationHeaderItem {
  icon: NavigationHeaderIcon
  label: string
  path: string
}

interface NavigationHeaderDropdownMenuProps {
  ariaLabel?: string
  buttonClassName?: string
  dropdownClassName?: string
  itemGroups: NavigationHeaderItem[][]
  label?: string
  leadingIcon?: ReactElement
}

export type {
  NavigationHeaderDropdownMenuProps,
  NavigationHeaderIcon,
  NavigationHeaderItem,
  SupportedIcon,
}
