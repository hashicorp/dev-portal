import { SUPPORTED_ICONS } from 'content/supported-icons'
import IconCardLinkGridList from 'components/icon-card-link-grid-list'
import { IconCardGridBlockCard, IconCardGridBlockProps } from './types'
import { Section } from '../section'

const IconCardGridBlock = ({
	heading,
	subheading,
	cards,
	productSlug,
}: IconCardGridBlockProps) => {
	return (
		<Section heading={heading} subheading={subheading}>
			<IconCardLinkGridList
				cards={cards.map(({ iconName, text, url }: IconCardGridBlockCard) => ({
					icon: SUPPORTED_ICONS[iconName],
					text,
					url,
				}))}
				productSlug={productSlug}
			/>
		</Section>
	)
}

export type { IconCardGridBlockCard, IconCardGridBlockProps }
export { IconCardGridBlock }
