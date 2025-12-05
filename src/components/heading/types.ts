/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * NOTE: this approach gets us around the following error:
 *
 * "An interface can only extend an identifier/qualified-name with optional type
 * arguments. ts(2499)"
 */
type HeadingElementProps =
	| Omit<JSX.IntrinsicElements['h1'], 'ref'>
	| Omit<JSX.IntrinsicElements['h2'], 'ref'>
	| Omit<JSX.IntrinsicElements['h3'], 'ref'>
	| Omit<JSX.IntrinsicElements['h4'], 'ref'>
	| Omit<JSX.IntrinsicElements['h5'], 'ref'>
	| Omit<JSX.IntrinsicElements['h6'], 'ref'>

export interface HeadingProps extends HeadingElementProps {
	/**
	 * Set the HTML heading level.
	 */
	level: 1 | 2 | 3 | 4 | 5 | 6
	size: 100 | 200 | 300 | 400 | 500 | 600
	weight: 'regular' | 'medium' | 'semibold' | 'bold'
}
