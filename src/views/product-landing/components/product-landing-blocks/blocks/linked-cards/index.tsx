import CardLink from 'components/card-link'
import CardsGridList from 'components/cards-grid-list'
import { LinkedCard, LinkedCardsProps } from './types'

function LinkedCards({ cards }: LinkedCardsProps) {
	return (
		<CardsGridList>
			{cards.map((card: LinkedCard) => {
				return (
					<li key={card.url}>
						<CardLink
							ariaLabel={card.heading}
							href={card.url}
							title={card.heading}
							description={card.body}
						/>
					</li>
				)
			})}
		</CardsGridList>
	)
}

export type { LinkedCardsProps }
export { LinkedCards }
