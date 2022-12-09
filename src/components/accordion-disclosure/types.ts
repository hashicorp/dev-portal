import { ReactNode } from 'react'
import { DisclosureProps } from 'components/disclosure'

export interface AccordionDisclosureProps {
	/**
	 * The disclosed content to render within the `AccordionDisclosure` container.
	 * This will only show when the `AccordionDisclosure` is open.
	 */
	children: ReactNode

	/**
	 * Secondary label text that renders below the main `title` with less
	 * emphasis. Always shows regardless of the `AccordionDisclosure`'s
	 * open/closed state.
	 */
	description?: ReactNode

	/**
	 * Optional prop that that enables a `AccordionDisclosure` to be rendered open
	 * on initial load.
	 */
	initialOpen?: DisclosureProps['initialOpen']

	/**
	 * The main text label that always shows regardless of the
	 * `AccordionDisclosure`'s open/closed state. These should be descriptive of
	 * the disclosed content; labels like "Section 1" or "Section 2" is not very
	 * descriptive.
	 */
	title: ReactNode

	/**
	 * Whether this disclosure is the first in a group of similar items.
	 * If `true`, specific styles for the first item in a group will be applied.
	 * If `false`, then styles will be applied assuming there is a previous item.
	 * If `undefined`, no disclosure group styles will be applied.
	 */
	isFirstItem?: boolean

	/**
	 * Whether this disclosure is the last in a group of similar items.
	 * If `true`, specific styles for the last item in a group will be applied.
	 * If `false`, then styles will be applied assuming there is a next item.
	 * If `undefined`, no disclosure group styles will be applied.
	 */
	isLastItem?: boolean
}
