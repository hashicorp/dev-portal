/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode } from 'react'
import { ButtonProps } from 'components/button'

/**
 * Props inherited directly from the `ButtonProps` interface.
 */
type PickedButtonProps = Pick<
	ButtonProps,
	| 'aria-controls'
	| 'aria-expanded'
	| 'aria-label'
	| 'aria-describedby'
	| 'className'
>

/**
 * Additional custom props `DropdownDisclosureActivator` accepts.
 */
interface DropdownDisclosureActivatorProps extends PickedButtonProps {
	/**
	 * The content of the rendered `<button>`component. If a string is given, a
	 * `Button` will be rendered with `children` sent as the `text` prop.
	 * Otherwise, a `<button>` will be rendered with `children` passed as the
	 * `children` prop.
	 */
	children: ButtonProps['text'] | ReactNode

	/**
	 * Optional. When the Button component is rendered, specifies what color
	 * variant it should be.
	 */
	color?: Extract<ButtonProps['color'], 'primary' | 'secondary'>

	/**
	 * Optional. Specifies whether or not the chevron icon should be shown in the
	 * activator. False by default.
	 */
	hideChevron?: boolean
}

export type { DropdownDisclosureActivatorProps }
