import { ProductSlug } from 'types/products'
import { NavigationHeaderItem } from 'components/navigation-header/types'

export interface NavItemLink {
	type: 'link'
	label: string
	url: string
}

export interface NavItemSubmenu {
	type: 'submenu'
	label: string
	iconColorTheme: ProductSlug
	items: NavigationHeaderItem[]
}

export type NavItem = NavItemLink | NavItemSubmenu
