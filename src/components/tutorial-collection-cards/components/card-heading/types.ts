/**
 * Copyright IBM Corp. 2022, 2026
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
