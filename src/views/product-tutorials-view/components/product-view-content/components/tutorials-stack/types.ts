import { TutorialCardPropsWithId } from 'components/tutorial-card'

export interface TutorialsStackProps {
	/** Heading to show above the tutorial cards. */
	heading?: string
	/**
	 * Identifier for the heading, which should unique in the context of the page
	 * Note: headingSlug is added after fetching content from the Learn API
	 */
	headingSlug?: string
	/** Subheading to show above the tutorial cards. */
	subheading?: string
	tutorialCards: TutorialCardPropsWithId[]
}
