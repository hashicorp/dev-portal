/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { LinkProps } from 'components/link'
import { PropsWithChildren } from 'react'

type InheritedLinkProps = Pick<LinkProps, 'href' | 'onClick' | 'opensInNewTab'>

export interface LinkRegionProps extends PropsWithChildren<InheritedLinkProps> {
	/**
	 * Optional className to set on the root element. This `className` can set
	 * a `--border-radius` CSS custom property in order to control the
	 * `border-radius` of the link focus outline.
	 */
	className?: string

	/**
	 * The text used as the `LinkRegion`'s accessible label. Required so the element
	 * is announced by screen readers.
	 */
	ariaLabel: LinkProps['aria-label']

	/**
	 * An optional data-heap-track string to place on the `<a />` element.
	 */
	'data-heap-track'?: string
}
