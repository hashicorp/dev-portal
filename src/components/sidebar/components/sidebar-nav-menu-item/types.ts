/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactElement } from 'react'
import { IconChevronDown16 } from '@hashicorp/flight-icons/svg-react/chevron-down-16'
import { Badge, type BadgeProps } from '@hashicorp/mds-react/components'
import { MenuItem } from 'components/sidebar'
import { ProductSlug } from 'types/products'

interface RightIconsContainerProps {
	badge?: ReturnType<typeof Badge>
	icon?: ReturnType<typeof IconChevronDown16>
}

interface SidebarNavMenuItemBadgeProps {
	color?: Exclude<
		BadgeProps['color'],
		'error' | 'success' | 'warning'
	>
	text: BadgeProps['text']
	type?: BadgeProps['type']
}

interface SidebarNavMenuItemProps {
	item: MenuItem
}

type SupportedIconName = 'home' & 'guide' & ProductSlug
interface SidebarNavLinkItem extends MenuItem {
	leadingIconName?: SupportedIconName
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
