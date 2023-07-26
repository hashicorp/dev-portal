/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { PropsWithChildren, ReactNode } from 'react'
// Layout
import BaseLayout from 'layouts/base-layout'
// Styles
import s from './sidebar-layout.module.css'

/**
 * Renders a sidebar area alongside a main content area.
 *
 * The sidebar area is layed out as a sticky column on large viewports.
 * When very tall content is provided, the sidebar area will scroll vertically.
 *
 * The sidebar area is completely hidden on mobile viewports.
 * Consumers should ensure that equivalent navigational elements
 * are provided through the `mobileMenuSlot` prop.
 *
 * Note: this layout could _potentially_ be of use in `SidebarSidecarLayout`.
 * For context, this layout was created after `SidebarSidecarLayout`, with the
 * initial intent of making it easier to build a new OpenAPI docs view.
 * It will likely make sense to consolidate somewhat duplicate layout logic between
 * this component and `SidebarSidecarLayout`, but this did not feel like it
 * was within the scope of the OpenAPI docs view work.
 * Task:
 * https://app.asana.com/0/1202097197789424/1205088749290838/f
 */
function SidebarLayout({
	children,
	sidebarSlot,
	mobileMenuSlot,
}: PropsWithChildren<{
	mobileMenuSlot: ReactNode
	sidebarSlot: ReactNode
}>) {
	return (
		<BaseLayout mobileMenuSlot={mobileMenuSlot} showFooterTopBorder>
			<div className={s.root}>
				<div className={s.sidebarArea}>{sidebarSlot}</div>
				<div className={s.mainArea}>{children}</div>
			</div>
		</BaseLayout>
	)
}

export default SidebarLayout
