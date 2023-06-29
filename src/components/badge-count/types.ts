/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

export interface BadgeCountProps {
	/**
	 * The size of the badge, which mainly affects font size and padding. The
	 * default value is "medium".
	 */
	size?: 'small' | 'medium' | 'large'

	/**
	 * The text to render inside of the badge.
	 */
	text: string

	/**
	 * The kind of style to apply to the badge, which mainly affects background
	 * color and border.
	 */
	type?: 'filled' | 'inverted' | 'outlined'

	/**
	 * Note: HDS names the dark theme `neutral-dark-mode`.
	 * Have renamed here to `neutral-dark` to avoid confusion
	 * with "dark mode" settings, which _seem_ to be separate from the
	 * distinction between the light and dark themes of this component.
	 */
	color?: 'neutral' | 'neutral-dark'
}
