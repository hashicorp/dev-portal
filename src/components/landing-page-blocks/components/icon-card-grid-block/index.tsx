import { SUPPORTED_ICONS } from 'content/supported-icons'
import IconCardLinkGridList from 'components/icon-card-link-grid-list'
import { IconCardGridBlockCard, IconCardGridBlockProps } from './types'

const IconCardGridBlock = ({ cards, productSlug }: IconCardGridBlockProps) => {
	return (
		<IconCardLinkGridList
			cards={cards.map(({ iconName, text, url }: IconCardGridBlockCard) => ({
				icon: SUPPORTED_ICONS[iconName],
				text,
				url,
			}))}
			productSlug={productSlug}
		/>
	)
}

export type { IconCardGridBlockCard, IconCardGridBlockProps }
export { IconCardGridBlock }
