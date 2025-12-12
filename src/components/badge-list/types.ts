/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { BadgeProps } from "@hashicorp/mds-react/components"

export interface BadgeListBadgeProps {
	text: BadgeProps['text']
	icon?: BadgeProps['icon']
	color?: BadgeProps['color']
	tooltip?: string
}

export interface BadgeListProps {
	badges: Array<BadgeListBadgeProps>
	className?: string
	size?: BadgeProps['size']
	type?: BadgeProps['type']
}
