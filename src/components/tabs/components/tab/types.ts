import { ReactNode } from 'react'

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
	 * An optional icon to render before the text of a Tab.
	 */
	icon?: JSX.IntrinsicElements['svg']
}
