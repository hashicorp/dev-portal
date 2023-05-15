/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { type ReactElement, type ReactNode } from 'react'

export interface TabProps {
	/**
	 * The content to render within the tab panel
	 */
	children?: ReactNode

	/**
	 * Optional render function to provide as an alternative to `children`.
	 * This allows consumers to use elements within the content to set
	 * the active tab.
	 *
	 * TODO: maybe combine with `children` prop or something, somehow? Or...
	 * Note that if both children and renderContent are provided,
	 * only renderContent will be used.
	 */
	renderContent?: (props: {
		activeTabIndex: number
		setActiveTabIndex: (idx: number) => void
	}) => ReactNode

	/**
	 * The text to show in the tab button
	 */
	heading: string

	/**
	 * TODO: add description
	 */
	labelSlot?: ReactNode

	/**
	 * An optional icon to render before the text of a Tab.
	 */
	icon?: ReactElement<React.JSX.IntrinsicElements['svg']>
}
