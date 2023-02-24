/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import type { HeadingProps } from 'components/heading'

export interface CardHeadingProps {
	text: string
	level: HeadingProps['level']

	/**
	 * If true, visually hide the heading element.
	 */
	screenReaderOnly?: boolean
}
