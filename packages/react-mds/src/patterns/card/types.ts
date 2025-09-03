import type { PropsWithChildren, ReactNode } from 'react'
import type { ProductBadgeProps } from '@hashicorp/react-mds/src/patterns/product-badge'
import type { NewsroomCardProps } from './newsroom-card'
import type { PersonCardProps } from './person-card'
import type { ResourceCardProps } from './resource-card'
import type { UnifiedCardProps } from './unified-card'

interface BaseCardProps
	extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'aria-label'> {
	withArrow?: boolean
	link: string
	clickHandler?: () => void
	isExternal?: boolean
}

interface CardPrimitiveProps extends BaseCardProps {
	children: ReactNode
	'aria-label': string
}

interface ThumbnailProps {
	src: string
	alt: string
}

interface MetaProps {
	items: Array<string | ReactNode>
}

type ContentProps = PropsWithChildren

interface HeadingProps {
	as?: 'h2' | 'h3' | 'h4'
	children: string
}

interface ProductBadgesProps extends PropsWithChildren {
	badges: Array<ProductBadgeProps['productName']>
}

type DescriptionProps = PropsWithChildren

interface CardProps extends BaseCardProps {
	heading: string
	thumbnail?: ThumbnailProps
	meta?: MetaProps['items']
	description?: DescriptionProps['children']
	productBadges?: ProductBadgesProps['badges']
	'aria-label'?: string
}

export type {
	CardPrimitiveProps,
	ThumbnailProps,
	MetaProps,
	ContentProps,
	HeadingProps,
	ProductBadgesProps,
	DescriptionProps,
	CardProps,
	NewsroomCardProps,
	PersonCardProps,
	ResourceCardProps,
	UnifiedCardProps,
}
