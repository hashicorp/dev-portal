/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactElement } from 'react'
import { IconChevronDown16 } from '@hashicorp/flight-icons/svg-react/chevron-down-16'
import Badge, { BadgeProps } from 'components/badge'
import { MenuItemOptionalProperties } from 'components/sidebar'
import { ProductSlug } from 'types/products'

interface RightIconsContainerProps {
	badge?: ReturnType<typeof Badge>
	icon?: ReturnType<typeof IconChevronDown16>
}

interface SidebarNavMenuItemBadgeProps {
	color?: Exclude<
		BadgeProps['color'],
		'error' | 'neutral-dark-mode' | 'success' | 'warning'
	>
	text: BadgeProps['text']
	type?: BadgeProps['type']
}

type SupportedIconName = 'home' & 'guide' & ProductSlug
interface SidebarNavLinkItem extends MenuItemOptionalProperties {
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
	SupportedIconName,
}
