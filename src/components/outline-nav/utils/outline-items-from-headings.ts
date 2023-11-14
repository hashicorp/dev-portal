/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { OutlineLinkItem } from 'components/outline-nav/types'
import { filterTableOfContentsHeadings } from 'components/table-of-contents/utils/filter-table-of-contents-headings'
import { pruneHeadingsByLevel } from 'components/table-of-contents/utils/prune-headings-by-level'

/**
 * Heading type coming from our remark anchor-links plugin.
 */
export interface AnchorLinksPluginHeading {
	title: string
	slug: string
	level: 1 | 2 | 3 | 4 | 5 | 6
}

/**
 * Given a flat array of headings,
 * Return an array of outline items, for use with OutlineNav components.
 */
function outlineItemsFromHeadings(
	headings: AnchorLinksPluginHeading[]
): OutlineLinkItem[] {
	const filteredHeadings = pruneHeadingsByLevel(
		filterTableOfContentsHeadings(headings), 2
	)
	return filteredHeadings.map(
		(heading: AnchorLinksPluginHeading, index: number) => {
			const titleWithoutBackticks = heading.title.replace(/`/g, '')
			return {
				title: titleWithoutBackticks,
				url: `#${heading.slug}`,
				dataHeapTrack: `toc-list-item-index-${index}`,
			}
		}
	)
}

export default outlineItemsFromHeadings
