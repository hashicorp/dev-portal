/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { CardProps } from 'components/card'
import { LinkProps } from 'components/link'

type InheritedCardProps = Pick<CardProps, 'children' | 'className'>
type InheritedLinkProps = Pick<LinkProps, 'href' | 'onClick' | 'opensInNewTab'>

export interface CardLinkProps extends InheritedCardProps, InheritedLinkProps {
	/**
	 * The text used as the `CardLink`'s accessible label. Required so the element
	 * is announced by screen readers.
	 */
	ariaLabel: LinkProps['aria-label']

	/**
	 * An optional data-heap-track string to place on the `<a />` element.
	 */
	'data-heap-track'?: string
}
