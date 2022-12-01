import CardsGridList from 'components/cards-grid-list'
import IconCardLink from 'components/icon-card-link'
import { IconCardLinkGridListProps, IconCard } from './types'

function IconCardLinkGridList({
	cards,
	productSlug,
	gridGap,
	fixedColumns,
}: IconCardLinkGridListProps) {
	return (
		<CardsGridList gridGap={gridGap} fixedColumns={fixedColumns}>
			{cards.map((iconCard: IconCard, key: number) => {
				return (
					<IconCardLink
						// eslint-disable-next-line react/no-array-index-key
						key={key}
						icon={iconCard.icon}
						productSlug={iconCard.productSlug || productSlug}
						text={iconCard.text}
						url={iconCard.url}
					/>
				)
			})}
		</CardsGridList>
	)
}

export type { IconCardLinkGridListProps }
export default IconCardLinkGridList
