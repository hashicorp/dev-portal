import { ReactNode } from 'react'
import { ProductOption } from 'lib/learn-client/types'

export interface TutorialCardProps {
	/**
	 * A short description of the tutorial.
	 */
	description: string

	/**
	 * A string representation the duration of the tutorial, such as "10mins".
	 */
	duration: string

	/**
	 * Whether the tutorial has an embedded interactive lab.
	 */
	hasInteractiveLab: boolean

	/**
	 * Whether the tutorial has a video associated with it.
	 */
	hasVideo: boolean

	/**
	 * The title of the tutorial.
	 */
	heading: string

	/**
	 * A URL that links to the tutorial.
	 */
	url: string

	/**
	 * A list of product slugs, representing products used in the tutorial.
	 */
	productsUsed: ProductOption[]

	/**
	 * TODO: add description
	 */
	eyebrowSlot?: ReactNode
}

export interface TutorialCardPropsWithId extends TutorialCardProps {
	/**
	 * The tutorial's unique identifier
	 */
	id: string
	/**
	 * The collection context's unique identifier
	 * TODO: this is required for collection-context-specific progress display.
	 * I think we collection-specific progress display in most uses of this card.
	 * So, may need to ensure this prop gets passed in, via formatTutorialCard.
	 *
	 * TLDR:
	 * TODO: make this not optional, should always be passed in.
	 */
	collectionId?: string
}
