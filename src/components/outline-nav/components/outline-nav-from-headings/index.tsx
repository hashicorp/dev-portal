import { OutlineHeading, OutlineLinkItem } from 'components/outline-nav/types'
import { OutlineNavWithActive } from 'components/outline-nav/components'
import { useMemo } from 'react'

/**
 * Given a flat array of headings,
 * Return an array of outline items, for use with OutlineNav components.
 */
function buildOutlineItems(headings: OutlineHeading[]): OutlineLinkItem[] {
	return headings.map((heading: OutlineHeading) => {
		/* TODO: maybe consider resolving the backticks issue closer to server? */
		const titleWithoutBackticks = heading.title.replace(/`/g, '')
		return {
			title: titleWithoutBackticks,
			url: `#${heading.slug}`,
		}
	})
}

/**
 * Given a flat array of headings in a document,
 * render an outline nav, and automatically highlight the active heading.
 */
function OutlineNavFromHeadings({ headings }: { headings: OutlineHeading[] }) {
	const items = useMemo(() => buildOutlineItems(headings), [headings])
	return <OutlineNavWithActive items={items} />
}

export { OutlineNavFromHeadings }
