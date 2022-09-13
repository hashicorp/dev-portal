import { SUPPORTED_ICONS } from 'content/supported-icons'
import { IconCardLinkProps } from 'components/icon-card-link'

export interface GetStartedCardProps {
	heading: string
	headingSlug: string
	body: string
	ctas?: {
		text: string
		url: string
	}[]
	iconCardLinks?: {
		icon: keyof typeof SUPPORTED_ICONS
		text: IconCardLinkProps['text']
		url: IconCardLinkProps['url']
	}[]
	fixedColumns?: 2 | 3
}
