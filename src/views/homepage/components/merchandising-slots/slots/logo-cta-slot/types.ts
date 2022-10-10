import { ReactElement } from 'react'

export interface LogoCtaSlotProps {
	/** URL to link to */
	url: string
	/* Title for the card, visually hidden */
	cardTitle: string
	description: string
	ctaText: string
	/* Logo SVG string */
	logoSrc: string
	/* Background slot, to allow consumer to render custom background elems */
	backgroundSlot: ReactElement
	/**
	 * Optional CSS max-width property for the description container.
	 * This allows more granular control over how text interacts with background.
	 * Defaults to 14em.
	 */
	descriptionMaxWidth?: string
}
