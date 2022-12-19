import { BadgeProps } from 'components/badge'
import { ReactElement } from 'react'
import { ProductSlug } from 'types/products'

type SupportedIcon =
	| 'api'
	| 'docs'
	| 'entry-point'
	| 'home'
	| 'plug'
	| 'terminalScreen'

type NavigationHeaderIcon = ProductSlug | SupportedIcon

interface BaseNavigationHeaderItem {
	badge?: {
		color?: BadgeProps['color']
		text: BadgeProps['text']
	}
	icon: NavigationHeaderIcon
	label: string
}

type PossiblyDisabledNavigationHeaderItem =
	| {
			ariaLabel?: never
			path: string
	  }
	| {
			ariaLabel: string
			path?: never
	  }
	| {
			ariaLabel: string
			path: string
	  }

/**
 * Always requires icon and label. Requires at least one of ariaLabel and path.
 */
type NavigationHeaderItem = BaseNavigationHeaderItem &
	PossiblyDisabledNavigationHeaderItem

interface NavigationHeaderItemGroup {
	label?: string
	items: NavigationHeaderItem[]
}

interface NavigationHeaderDropdownMenuProps {
	ariaLabel?: string
	buttonClassName?: string
	dropdownClassName?: string
	iconClassName?: string
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
