/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { BadgeProps } from "@hashicorp/mds-react/components"

export interface BadgeListBadge {
	text: BadgeProps['text']
	icon?: BadgeProps['icon']
	color?: BadgeProps['color']
	tooltip?: string
}

export interface BadgeListProps {
	badges: Array<BadgeListBadge>
	className?: string
	size?: BadgeProps['size']
	type?: BadgeProps['type']
}
