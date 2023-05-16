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
	 * The `heading` is plain text used with `<select />`-based tab controls.
	 * It is always required, as we must use `<select />`-based tab controls on
	 * certain smaller viewport sizes.
	 */
	heading: string

	/**
	 * The optional `headingSlot` is used with `<button />`-based tab controls.
	 * It allows rendering arbitrary content, and generally appears only
	 * at larger viewport sizes.
	 *
	 * If `headingSlot` is not provided, the `heading` string will be used with
	 * both the `<select />` and `<button />` based tab controls.
	 */
	headingSlot?: ReactNode

	/**
	 * An optional icon to render before the text of a Tab.
	 */
	icon?: ReactElement<React.JSX.IntrinsicElements['svg']>
}
