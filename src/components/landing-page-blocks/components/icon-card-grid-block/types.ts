import { ProductSlug } from 'types/products'
import { SUPPORTED_ICONS } from 'content/supported-icons'
import { IconCardLinkGridListCard } from 'components/icon-card-link-grid-list'
import { SectionProps } from '../section'

interface IconCardGridBlockCard {
	iconName: keyof typeof SUPPORTED_ICONS
	text: IconCardLinkGridListCard['text']
	url: IconCardLinkGridListCard['url']
}

interface IconCardGridBlockProps
	extends Pick<SectionProps, 'heading' | 'subheading'> {
	cards: IconCardGridBlockCard[]
	productSlug: ProductSlug
}

export type { IconCardGridBlockCard, IconCardGridBlockProps }
