import { OutlineLinkItem } from 'components/outline-nav/types'

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
	return headings.map((heading: AnchorLinksPluginHeading, index: number) => {
		const titleWithoutBackticks = heading.title.replace(/`/g, '')
		return {
			title: titleWithoutBackticks,
			url: `#${heading.slug}`,
			dataHeapTrack: `toc-list-item-index-${index}`,
		}
	})
}

export default outlineItemsFromHeadings
