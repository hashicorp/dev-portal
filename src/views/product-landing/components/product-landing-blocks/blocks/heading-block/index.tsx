/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { HeadingBlockProps } from './types'
import s from './heading-block.module.css'

function HeadingBlock({ heading, headingSlug }: HeadingBlockProps) {
	return (
		<h2 id={headingSlug} className={s.heading}>
			{heading}
		</h2>
	)
}

export type { HeadingBlockProps }
export { HeadingBlock }
