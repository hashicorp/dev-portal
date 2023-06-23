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
	text?: string

	/**
	 * The kind of style to apply to the badge, which mainly affects background
	 * color and border.
	 */
	type?: 'filled' | 'inverted' | 'outlined'

	/**
	 * Note: HDS supports `neutral-dark-mode` as a separate color.
	 * In Dev Dot, we support a single `neutral` color that is used for both
	 * light and dark mode.
	 */
	color?: 'neutral'
}
