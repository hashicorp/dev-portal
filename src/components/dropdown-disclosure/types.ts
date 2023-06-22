/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { DisclosureProps } from 'components/disclosure'
import { ReactElement, ReactNode } from 'react'
import { DropdownDisclosureActivatorProps } from './components/activator'

/**
 * Props inherited directly from the `DropdownDisclosureActivatorProps`
 * interface.
 */
type PickedDropdownDisclosureActivatorProps = Pick<
	DropdownDisclosureActivatorProps,
	'color' | 'hideChevron'
>

type PickedDisclosureProps = Pick<DisclosureProps, 'closeOnRouteChangeStart'>

/**
 * Additional custom props `DropdownDisclosure` accepts.
 */
interface DropdownDisclosureProps
	extends PickedDropdownDisclosureActivatorProps,
		PickedDisclosureProps {
	/**
	 * An optional `className` that is passed to the internally rendered
	 * `DropdownDisclosureActivator`.
	 */
	activatorClassName?: string

	/**
	 * Text that should be announced by a screen reader when the activator
	 * `<button>` comes into focus. Should only be provided in two cases:
	 *
	 *   1. The visual `label` prop is not provided
	 *   2. The visual `label` prop is not descriptive without visual affordances
	 */
	'aria-label'?: DropdownDisclosureActivatorProps['aria-label']

	'aria-describedby'?: DropdownDisclosureActivatorProps['aria-describedby']

	/**
	 * Elements to render within the dropdown portion of the component. Expected
	 * to be an array of subcomponents exported from `components/list-item`.
	 */
	children?: ReactNode[]

	/**
	 * Optional. Appended to the list of classnames sent to the  inner-rendered
	 * `Disclosure` component.
	 */
	className?: string

	/**
	 * A Flight icon or `<img />` element to render within the activator
	 * `<button>`. Should only be provided if no `label` is provided.
	 */
	icon?: ReactElement

	/**
	 * The text to render within the activator `<button>`. Should only be provided
	 * if no `icon` is provided.
	 */
	text?: string

	/**
	 * Whether or not the component should be left- or right-aligned in its
	 * container. The default is "left".
	 */
	listPosition?: 'left' | 'right'

	isFullWidth?: boolean
}

export type { DropdownDisclosureProps }
