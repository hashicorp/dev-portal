import { TutorialCardsProps } from './types'
import CardsGridList from 'components/cards-grid-list'
import {
	ConnectedTutorialCard,
	TutorialCardPropsWithId,
} from 'components/tutorial-card'

function TutorialCards({ tutorialCards }: TutorialCardsProps) {
	return (
		<CardsGridList>
			{tutorialCards.map((cardPropsWithId: TutorialCardPropsWithId) => {
				return (
					<li key={cardPropsWithId.id}>
						<ConnectedTutorialCard {...cardPropsWithId} />
					</li>
				)
			})}
		</CardsGridList>
	)
}

export type { TutorialCardsProps }
export { TutorialCards }
