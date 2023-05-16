/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { type ReactElement, type ReactNode } from 'react'

export interface TabProps {
	/**
	 * The content to render within the tab panel
	 */
	children: ReactNode

	/**
	 * The text to show in the tab button
	 */
	heading: string

	/**
	 * Optional element to show in place of plain heading text on viewports large
	 * enough to accommodate `button`-based Tab controls.
	 *
	 * Note that on smaller viewports, `headingSlot` is not used. We must use
	 * the plain `heading` text as we're rendering a native `select` element.
	 */
	headingSlot?: ReactNode

	/**
	 * An optional icon to render before the text of a Tab.
	 */
	icon?: ReactElement<React.JSX.IntrinsicElements['svg']>
}
