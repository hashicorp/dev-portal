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
		// TODO reference SUPPORTED_ICONS
		icon: string
		text: IconCardLinkProps['text']
		url: IconCardLinkProps['url']
	}[]
}
