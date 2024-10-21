/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Components
import SidebarBackToLink from '@components/sidebar/components/sidebar-back-to-link'
import { SidebarNavMenuItem } from '@components/sidebar/components'
// Types
import type { OpenApiNavItem } from 'views/open-api-docs-view-v2/types'
// Styles
import s from './style.module.css'

/**
 * TODO: lift this content up so it can vary page-to-page
 */
const SHIM_CONTENT = {
	backToLink: {
		text: 'HashiCorp Cloud Platform',
		href: '/hcp',
	},
}

export function OpenApiV2SidebarContents({ navItemLanding, navItemGroups }) {
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
	return (
		<>
			<SidebarBackToLink
				text={SHIM_CONTENT.backToLink.text}
				href={SHIM_CONTENT.backToLink.text}
			/>
			<ul className={s.listResetStyles}>
				<SidebarNavMenuItem item={navItemLanding} />
				{navItemGroups.map((navItemGroup) => {
					return (
						<ul className={s.listResetStyles}>
							<SidebarNavMenuItem item={{ heading: navItemGroup.title }} />
							<li>
								<SidebarNavMenuItemsList items={navItemGroup.items} />
							</li>
						</ul>
					)
				})}
			</ul>
		</>
	)
}
/**
 * Renders an unordered list of nav items, with list styles reset.
 */
export function SidebarNavMenuItemsList({
	items,
}: {
	items: OpenApiNavItem[]
}) {
	return (
		<ul className={s.listResetStyles}>
			{items.map((item: OpenApiNavItem, index: number) => (
				// eslint-disable-next-line react/no-array-index-key
				<SidebarNavMenuItem item={item} key={index} />
			))}
		</ul>
	)
}
