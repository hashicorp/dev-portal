import { ReactElement } from 'react'

export interface EmptyStateProps {
	/**
	 * An icon from `@hashicorp/flight-icons` to render.
	 */
	icon?: JSX.IntrinsicElements['svg']

	/**
	 * Heading to render
	 */
	heading: string

	/**
	 * Subheading to render to provide additional context.
	 */
	subheading: string

	/**
	 * optional callToAction to render after the heading and subheading.
	 * Most likely some form of button.
	 */
	callToAction?: ReactElement
}
