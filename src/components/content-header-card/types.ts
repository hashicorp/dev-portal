/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { type ReactElement } from 'react'
import { Badge } from 'components/badge-list/types'
import { ProductSlug } from 'types/products'

export interface DropdownItem {
	text: string
	href: string
}

export interface Dropdown {
	text: string
	items: Array<DropdownItem>
}

export interface Link {
	text: string
	href: string
	icon?: React.ReactElement
}

export interface Button {
	text: string
	icon?: ReactElement<React.JSX.IntrinsicElements['svg']>
	isPrimary?: boolean
	onClick: () => void
}

export interface ContentHeaderCardProps {
	className?: string
	icon?: Exclude<ProductSlug, 'sentinel'>
	title: string
	attribution?: string
	description?: string
	note?: string
	badges?: Array<Badge>
	dropdown?: Dropdown
	links?: Array<Link>
	buttons?: Array<Button>
}

export interface VersionDropdownProps {
	className?: string
	dropdown?: Dropdown
}

export interface ButtonListProps {
	buttons?: Array<Button>
	hasLinks: boolean
	isReversed: boolean
}
