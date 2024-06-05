/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useMemo, useRef } from 'react'
import { useInView } from 'framer-motion'
import OutlineNav from 'components/outline-nav'
import { OutlineLinkItem } from 'components/outline-nav/types'
import {
	getItemSlugs,
	highlightActiveItems,
} from 'components/outline-nav/utils'
import { useActiveSection } from 'lib/hash-links/use-active-section'

/**
 * Given an array of OutlineLinkItems,
 * render an outline nav, and automatically highlight the active item.
 */
function OutlineNavWithActive({
	items,
}: {
	items: Omit<OutlineLinkItem, 'isActive'>[]
}) {
	const rootRef = useRef()
	const isInView = useInView(rootRef)

	/**
	 * Determine the active section. Note we only enable this when the sidecar
	 * is both visible and contains more than one item.
	 */
	const itemSlugs = useMemo(() => getItemSlugs(items), [items])
	const hasMultipleItems = itemSlugs.length > 1
	const enableActiveSection = isInView && hasMultipleItems
	const activeSection = useActiveSection(itemSlugs, enableActiveSection)

	/**
	 * Using the result from useActiveSection, highlight items.
	 * useMemo to only recalculate when items or activeSection changes.
	 */
	const itemsWithActive = useMemo(
		() => highlightActiveItems(items, `#${activeSection}`),
		[items, activeSection]
	)

	/**
	 * To match previous behaviour in TableOfContents,
	 * if we don't have multiple items, then we render null
	 */
	if (!hasMultipleItems) {
		// Next is caching refs so we need to hold on to this ref. Otherwise Next will lose this reference and break this component if we:
		// 1. visit a page with 0 or 1 items
		// 2. then visit a page with items
		return <div ref={rootRef}></div>
	}

	return (
		<div ref={rootRef}>
			<OutlineNav items={itemsWithActive} />
		</div>
	)
}

export { OutlineNavWithActive }
