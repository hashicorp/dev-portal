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

export type {
	ContentCardLinkBadge,
	ContentCardLinkEyebrowPart,
	ContentCardLinkProps,
}
