/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useRef } from 'react'
import { useActiveSection } from 'lib/hash-links/use-active-section'
import SidebarSidecarLayout, {
	SidebarSidecarLayoutProps,
} from 'layouts/sidebar-sidecar'
import OutlineNav from 'components/outline-nav'
import { OutlineLinkItem } from 'components/outline-nav/types'
import {
	getItemSlugs,
	highlightActiveItems,
} from 'components/outline-nav/utils'
import { DocsVersionAlertBanner } from './components'

export type DocsViewLayoutProps = SidebarSidecarLayoutProps & {
	outlineItems: OutlineLinkItem[]
}

/**
 * Lightweight wrapper around SidebarSidecarWithToc which passes along some docs
 * specific props.
 */
const DocsViewLayout = ({
	outlineItems,
	children,
	...layoutProps
}: DocsViewLayoutProps) => {
	const sectionsRef = useRef()

	/**
	 * Get the active section, and highlight outlineItems data.
	 */
	const itemSlugs = getItemSlugs(outlineItems)
	const activeSection = useActiveSection(itemSlugs, true, sectionsRef.current)
	const itemsWithActive = highlightActiveItems(
		outlineItems,
		`#${activeSection}`
	)

	return (
		<SidebarSidecarLayout
			{...layoutProps}
			sidecarSlot={<OutlineNav items={itemsWithActive} />}
			alertBannerSlot={<DocsVersionAlertBanner />}
		>
			<div ref={sectionsRef}>{children}</div>
		</SidebarSidecarLayout>
	)
}

export default DocsViewLayout
