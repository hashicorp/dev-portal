/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode } from 'react'
import { DisclosureProps } from 'components/disclosure'

export interface AccordionDisclosureProps {
	/**
	 * The disclosed content to render within the `AccordionDisclosure` container.
	 * This will only show when the `AccordionDisclosure` is open.
	 */
	children: ReactNode

	className?: string

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
	 * Optional prop to signal that this AccordionDisclosure is being
	 * placed in a group next to adjacent AccordionDisclosure components.
	 * We use this to control styling.
	 */
	groupData?: {
		/* The number of items in the group */
		numItems: number
		/* The index of this specific AccordionDisclosure in the group */
		currentIndex: number
	}
}
