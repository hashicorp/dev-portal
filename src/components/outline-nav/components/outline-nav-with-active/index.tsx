/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useMemo } from 'react'
import OutlineNav from 'components/outline-nav'
import { OutlineLinkItem } from 'components/outline-nav/types'
import {
	getItemSlugs,
	highlightActiveItems,
} from 'components/outline-nav/utils'
import { useDeviceSize } from 'contexts'
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
	/**
	 * We useDeviceSize to avoid running active heading calculations
	 * if we're on a viewport where we won't render the nav anyways.
	 *
	 * TODO: isDesktop isn't fully accurate, we may want to adjust this
	 * based on the specific breakpoint at which we show the sidecar.
	 *
	 * Thought: could we monitor the visibility of `OutlineNav` instead,
	 * ie the root element we're rendering in this component?
	 * If it's visible in CSS, then we should enable useActiveSection.
	 * If it's not visible, then we should NOT enable useActiveSection.
	 * Maybe a `useVisibility` hook or something would be useful here.
	 * Maybe this could reduce reliance on specific breakpoint metrics.
	 */
	const { isDesktop } = useDeviceSize()

	/**
	 * Determine the active section. Note we only enable this when the sidecar
	 * is both visible and contains more than one item.
	 */
	const itemSlugs = useMemo(() => getItemSlugs(items), [items])
	const hasMultipleItems = itemSlugs.length > 1
	const enableActiveSection = isDesktop && hasMultipleItems
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
		return null
	}

	return <OutlineNav items={itemsWithActive} />
}

export { OutlineNavWithActive }
