import { Tutorial as ClientTutorial } from 'lib/learn-client/types'
import { TutorialCardsGridList } from 'components/cards-grid-list'
import { formatTutorialCard } from 'components/tutorial-card/helpers'
import { FeaturedStack } from '../featured-stack'
import { TutorialsStackProps } from './types'

function TutorialsStack({
	featuredTutorials,
	heading,
	headingSlug,
	subheading,
}: TutorialsStackProps): JSX.Element {
	/**
	 * TODO: Instead of passing full ClientTutorial data to frontend,
	 * and trimming it down here to card data, it seems like we could
	 * do this trimming server side, and end up with a much smaller
	 * bundle of static props JSON.
	 * Asana task: https://app.asana.com/0/0/1202182325935203/f
	 */
	const tutorialCards = featuredTutorials.map((tutorial: ClientTutorial) => {
		const defaultContext = tutorial.collectionCtx.default
		const tutorialLiteCompat = { ...tutorial, defaultContext }
		return formatTutorialCard(tutorialLiteCompat)
	})

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
