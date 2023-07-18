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
