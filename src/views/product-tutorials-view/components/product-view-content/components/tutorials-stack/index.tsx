import { TutorialCardsGridList } from 'components/cards-grid-list'
import { FeaturedStack } from '../featured-stack'
import { TutorialsStackProps } from './types'

function TutorialsStack({
	tutorialCards,
	heading,
	headingSlug,
	subheading,
}: TutorialsStackProps): JSX.Element {
	return (
		<FeaturedStack
			heading={heading}
			headingSlug={headingSlug}
			subheading={subheading}
		>
			<TutorialCardsGridList tutorials={tutorialCards} />
		</FeaturedStack>
	)
}

export type { TutorialsStackProps }
export { TutorialsStack }
