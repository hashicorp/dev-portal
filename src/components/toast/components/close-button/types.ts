/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

export interface CloseButtonProps {
	/**
	 * A label that describes the buttons action. Applied as aria-label value.
	 */
	ariaLabel: string

	/**
	 * Optional class to be added to the button element.
	 */
	className?: string

	/**
	 * A function that will be called when the button is clicked.
	 */
	onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}
