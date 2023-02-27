/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import outlineItemsFromHeadings, {
	AnchorLinksPluginHeading,
} from 'lib/docs/outline-items-from-headings'
import { OutlineNavWithActive } from 'components/outline-nav/components'
import { useMemo } from 'react'

/**
 * Given a flat array of headings in a document,
 * render an outline nav, and automatically highlight the active heading.
 */
function OutlineNavFromHeadings({
	headings,
}: {
	headings: AnchorLinksPluginHeading[]
}) {
	/* TODO: maybe consider doing this transform closer to server? */
	const items = useMemo(() => outlineItemsFromHeadings(headings), [headings])
	return <OutlineNavWithActive items={items} />
}

export { OutlineNavFromHeadings }
