/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { TableOfContentsHeading } from '../types'

/**
 * Filter headings for display in table of contents.
 *
 * - Retain headings with the requested heading level
 * - Retain headings that are not nested in <Tabs /> (tabbedSectionDepth == 0)
 *
 * Note that to filter based on `tabbedSectionDepth`, we rely on functionality
 * in our `anchor-links` `remark-plugin` to add that property. For details, see
 * the `tabbedSectionDepth` logic here:
 * https://github.com/hashicorp/remark-plugins/blob/0f2d21516ab3c7120a24456838d83390e3ab179d/plugins/anchor-links/index.js#L29
 *
 */
export function pruneHeadingsByLevel(
	headings: TableOfContentsHeading[],
  targetLevel: 1 | 2 | 3 | 4 | 5 | 6
): TableOfContentsHeading[] {
	return headings.filter((heading: TableOfContentsHeading) => {
		const { level, tabbedSectionDepth } = heading

		/**
		 * Only include headings that are *outside* of <Tabs />.
		 *
		 * In other words, the `tabbedSectionDepth` must be 0 for a heading
		 * to be included in the table of contents.
		 */
		if (typeof tabbedSectionDepth === 'number' && tabbedSectionDepth !== 0) {
			return false
		}

		/**
		 * Return true if the heading level matches the requested header level
		 */
		if (level == targetLevel) {
			return true
		}

		/**
		 * Return false for all other headings
		 */
		return false
	})
}
