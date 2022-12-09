import { AccordionDisclosureProps } from 'components/accordion-disclosure'
import { ReactNode } from 'react'

export type AccordionContentItem = {
	title: string
	content: ReactNode
}

export type AccordionProps = {
	className?: string
	items: AccordionContentItem[]

	/**
	 * Optionally specify an <h{n} /> level that will apply to each
	 * of the sections in the Accordion.
	 */
	activatorHeadingLevel?: AccordionDisclosureProps['activatorHeadingLevel']
}
