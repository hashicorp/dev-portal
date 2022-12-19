import { TutorialCardsGridList } from 'components/cards-grid-list'
import { TutorialCardsProps } from './types'

function TutorialCards({ tutorialCards }: TutorialCardsProps) {
	return <TutorialCardsGridList tutorials={tutorialCards} />
}

export type { TutorialCardsProps }
export { TutorialCards }
