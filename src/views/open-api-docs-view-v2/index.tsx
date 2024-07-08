/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Layout
import SidebarLayout from 'layouts/sidebar-layout'
// Components
import LandingContent from './components/landing-content'
import OperationContent from './components/operation-content'
// Types
import type { OpenApiDocsViewV2Props } from './types'

/**
 * Placeholder view component for a new OpenAPI docs setup.
 *
 * This new setup will split each operation into its own URL,
 * and render an overview page at the base URL.
 */
export default function OpenApiDocsViewV2({
	basePath,
	navItems,
	...restProps
}: OpenApiDocsViewV2Props) {
	return (
		<SidebarLayout
			sidebarSlot={
				/**
				 * TODO: refine generation of nav items, and then render them properly,
				 * for now just messily rendering some links to enable navigation.
				 *
				 * Note: `next/link` will work in prod, since we'll be doing
				 * `getStaticProps`... but in the preview tool, `next/link` seems to
				 * make the preview experience janky, seemingly requiring reloads after
				 * each navigation, maybe related to use of getServerSideProps? Not yet
				 * sure how to resolve this, there's probably some clever solution that
				 * might be possible...
				 */
				<ul style={{ margin: 0, border: '1px solid magenta' }}>
					{navItems.map((navItem) => {
						if (!('fullPath' in navItem)) {
							return null
						}
						return (
							<li key={navItem.fullPath}>
								<a
									href={navItem.fullPath}
									style={{ color: navItem.isActive ? 'white' : undefined }}
								>
									{navItem.title}
								</a>
							</li>
						)
					})}
				</ul>
			}
			/**
			 * TODO: implement mobile menu. May be tempting to try to re-use the data
			 * that feeds the sidebar, and this MAY be the right call, or MAY make
			 * sense to have them a bit more separate (more flexibility in how we
			 * present the sidebar, without having to disentangle all the complexity
			 * of the mobile menu quite yet).
			 */
			mobileMenuSlot={null}
		>
			<div style={{ padding: '24px' }}>
				<div style={{ border: '1px solid magenta' }}>
					{'operationContentProps' in restProps ? (
						<OperationContent {...restProps.operationContentProps} />
					) : 'landingContentProps' in restProps ? (
						<LandingContent {...restProps.landingContentProps} />
					) : null}
				</div>
			</div>
		</SidebarLayout>
	)
}
