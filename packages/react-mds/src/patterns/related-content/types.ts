import type { CardProps } from '../card/types'

interface RelatedContentCtaProps {
	href: string
	text: string
}

type RelatedContentCardProps = Omit<CardProps, 'appearance'>

export interface RelatedContentProps {
	appearance?: 'light' | 'dark' | 'transparent'
	headline: string
	description?: string
	cards: Array<RelatedContentCardProps>
	cta?: RelatedContentCtaProps
}
