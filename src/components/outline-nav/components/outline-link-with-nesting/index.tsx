/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { OutlineListItems, OutlineLink } from '..'
import type { OutlineLinkWithNestingProps } from '../../types'
import s from './outline-link-with-nesting.module.css'

/**
 * Render an outline nav link,
 * with additional outline links indented in a nested section.
 */
function OutlineLinkWithNesting({
	title,
	url,
	isActive,
	items,
}: OutlineLinkWithNestingProps) {
	return (
		<>
			<OutlineLink title={title} url={url} isActive={isActive} />
			<ol className={s.nested} aria-label={title}>
				<OutlineListItems items={items} />
			</ol>
		</>
	)
}

export { OutlineLinkWithNesting }
