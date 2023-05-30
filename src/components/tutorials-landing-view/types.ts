import { ProductSlug } from 'types/products'
import { Collection } from 'lib/learn-client/types'
import { type BadgeProps } from 'components/badge'

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
	title: string
}

interface CollectionContentCardLinkProps {
	collection: Collection
}

interface CertificationContentCardLinkProps
	extends Pick<ContentCardLinkProps, 'description' | 'href' | 'title'> {
	productSlug: ProductSlug
}

export type {
	CertificationContentCardLinkProps,
	CollectionContentCardLinkProps,
	ContentCardLinkBadge,
	ContentCardLinkEyebrowPart,
	ContentCardLinkProps,
}
