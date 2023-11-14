/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { TableOfContentsHeading } from '../types'

/**
 * Filter headings for display in table of contents.
 *
 * - Retain headings that are <h1> or <h2>
 * 	- Headings <h3> through <h6> are filtered out.
 * - Retain headings that are not nested in <Tabs />
 * 	- Headings with `tabbedSectionDepth !== 0` are filtered out.
 *
 * Note that to filter based on `tabbedSectionDepth`, we rely on functionality
 * in our `anchor-links` `remark-plugin` to add that property. For details, see
 * the `tabbedSectionDepth` logic here:
 * https://github.com/hashicorp/remark-plugins/blob/0f2d21516ab3c7120a24456838d83390e3ab179d/plugins/anchor-links/index.js#L29
 *
 * TODO: given the above dependency on anchor-links remark plugin,
 * this utility might make sense to move closer to the server-side code where
 * the anchor-links plugin is invoked - maybe move this into `getStaticProps`?
 *
 */
export function filterTableOfContentsHeadings(
	headings: TableOfContentsHeading[]
): TableOfContentsHeading[] {
	return headings.filter((heading: TableOfContentsHeading) => {
		const { level, tabbedSectionDepth } = heading

		/**
		 * Only include <h2> in the table of contents.
		 *
		 * Note that <h1> are also included, this is as a stopgap
		 * while we implement content conformance that ensures there is
		 * exactly one <h1> per page (which we would likely not include here).
		 */
		if (level > 2) {
			return false
		}

		/**
		 * Only include headings that are *outside* of <Tabs />.
		 *
		 * In other words, the `tabbedSectionDepth` must be 0 for a heading
		 * to be included in the table of contents.
		 */
		if (typeof tabbedSectionDepth === 'number' && tabbedSectionDepth !== 0) {
			return false
		}

		// Exclude level 1 headings, which are used for the page title and should
		// not appear in the TOC
		if (level == 1) {
			return false
		}


		/**
		 * Return true for headings that have not been filtered out
		 * by previous criteria.
		 */
		return true
	})
}
