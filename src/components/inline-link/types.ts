/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { LinkProps } from 'components/link'
import { TextProps } from 'components/text'

export interface InlineLinkProps extends LinkProps {
	/**
	 * The content to render within the `<a>` element.
	 */
	children: LinkProps['children']

	/**
	 * A string of one or more class names. Applied last to the rendered `<a>`
	 * element.
	 */
	className?: LinkProps['className']

	/**
	 * Text style color, defaults to primary
	 * */
	color?: 'primary' | 'secondary'

	/**
	 * The destination of the link.
	 */
	href: LinkProps['href']

	/**
	 * The `size` used to apply a `hds-typography-body-` CSS helper class.
	 */
	textSize?: TextProps['size']

	/**
	 * The `weight` used to apply a `hds-font-weight-` CSS helper class.
	 */
	textWeight?: TextProps['weight']
}
