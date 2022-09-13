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
	 * Render elements in the area of the card above the heading.
	 * If omitted, will default to `duration`.
	 */
	eyebrowSlot?: ReactNode

	/**
	 * Optionally add to the the default aria-label for the card.
	 * This is intended for cases where `eyebrowSlot` contains information
	 * that should be added to the `aria-label`.
	 * If omitted, will default to a speakable version of `duration`.
	 */
	eyebrowSlotAriaLabel?: string
}

export interface TutorialCardPropsWithId extends TutorialCardProps {
	/**
	 * The tutorial's unique identifier
	 */
	id: string
	/**
	 * The collection context's unique identifier.
	 * This is required for collection-context-specific progress display.
	 */
	collectionId: string
}
