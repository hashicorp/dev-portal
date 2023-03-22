import { BadgeProps } from 'components/badge/types'

export interface Badge {
	text: BadgeProps['text']
	icon?: BadgeProps['icon']
	color?: BadgeProps['color']
	tooltip?: string
}

export interface BadgeListProps {
	badges: Array<Badge>
	className?: string
	size?: BadgeProps['size']
	type?: BadgeProps['type']
}
