/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProductName, ProductSlug } from 'types/products'
import { Collection } from 'lib/learn-client/types'
import { type BadgeProps } from 'components/badge'
import { CardLinkProps } from 'components/card-link'

interface ContentCardLinkBadge {
	icon: BadgeProps['icon']
	label: BadgeProps['ariaLabel']
}

type ContentCardLinkEyebrowPart = string

interface ContentCardLinkProps {
	backgroundImageColor?: 'light' | 'dark'
	backgroundImageUrl?: string
	badges?: ContentCardLinkBadge[]
	description: string
	eyebrowParts?: ContentCardLinkEyebrowPart[]
	headerImageUrl?: string
	href: string
	onClick?: CardLinkProps['onClick']
	title: string
}

interface CollectionContentCardLinkProps {
	collection: Collection
	hideBadges?: boolean
	hideImages?: boolean
}

interface CertificationContentCardLinkProps {
	certification: {
		slug: string
		title: string
		description: string
	}
	product: {
		name: ProductName
		slug: ProductSlug
	}
}

export type {
	CertificationContentCardLinkProps,
	CollectionContentCardLinkProps,
	ContentCardLinkBadge,
	ContentCardLinkEyebrowPart,
	ContentCardLinkProps,
}
