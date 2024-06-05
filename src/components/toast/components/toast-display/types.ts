/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { type ReactElement, type ReactNode } from 'react'

export enum ToastColor {
	neutral = 'neutral',
	highlight = 'highlight',
	success = 'success',
	warning = 'warning',
	critical = 'critical',
}

export interface ToastDisplayProps {
	/**
	 * Color theme for the toast. Defaults to "neutral".
	 */
	color?: ToastColor

	/**
	 * Description text. Note that HTML is not yet supported, but may be in the
	 * future. When a title is present, the description is shown below the title.
	 */
	description?: ReactNode

	/**
	 * A function to dismiss the toast that wraps this display component.
	 */
	dismissSelf: () => void

	/**
	 * Optional icon to render beside the toast's content area.
	 */
	icon?: ReactElement<React.JSX.IntrinsicElements['svg']>

	/**
	 * Optional render prop for actions below the toast's title and description.
	 * Expects one or many Button, ButtonLink, or StandaloneLink components.
	 * When passing multiple actions, wrapping them in a fragment is required
	 * to ensure correct spacing.
	 */
	renderActions?: (props: { dismissSelf: () => void }) => ReactNode

	/**
	 * Title text for the toast
	 */
	title?: string
}
