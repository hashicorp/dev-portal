/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { LinkProps } from 'components/link'
import { ReactNode } from 'react'

type InheritedLinkProps = Pick<LinkProps, 'href' | 'onClick' | 'opensInNewTab'>

export interface LinkRegionProps extends InheritedLinkProps {
	children: ReactNode
	className?: string

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
