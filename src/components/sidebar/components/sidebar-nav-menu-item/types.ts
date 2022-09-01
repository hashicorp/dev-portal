import { ReactElement } from 'react'
import { IconChevronRight16 } from '@hashicorp/flight-icons/svg-react/chevron-right-16'
import Badge, { BadgeProps } from 'components/badge'
import { MenuItem } from 'components/sidebar'
import { ProductSlug } from 'types/products'

interface RightIconsContainerProps {
	badge?: ReturnType<typeof Badge>
	icon?: ReturnType<typeof IconChevronRight16>
}

interface SidebarNavMenuItemBadgeProps {
	color?: Exclude<
		BadgeProps['color'],
		'error' | 'neutral-dark-mode' | 'success' | 'warning'
	>
	text: BadgeProps['text']
	type?: BadgeProps['type']
}

interface SidebarNavMenuItemProps {
	item: MenuItem
}

type SupportedIconName = 'home' & ProductSlug
interface SidebarNavLinkItem extends MenuItem {
	leadingIconName?: SupportedIconName
	rightIcon?: ReactElement
}

interface SidebarNavLinkItemProps {
	item: SidebarNavLinkItem
}

interface SidebarNavMenuButtonProps {
	item: { title: string; onClick(): void; icon: ReactElement }
}

export type {
	RightIconsContainerProps,
	SidebarNavMenuButtonProps,
	SidebarNavLinkItemProps,
	SidebarNavMenuItemBadgeProps,
	SidebarNavMenuItemProps,
	SupportedIconName,
}
