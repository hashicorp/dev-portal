/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Components
import { SidebarNavMenuItem } from 'components/sidebar/components'
// Utils
import { useNavItemsWithActive } from './utils/use-nav-items-with-active'
// Types
import type { OpenApiNavItem } from 'views/open-api-docs-view/types'
// Styles
import s from './open-api-sidebar-contents.module.css'

/**
 * Renders sidebar contents for OpenApiDocsView.
 */
export function OpenApiSidebarContents({
	navItems,
}: {
	navItems: OpenApiNavItem[]
}) {
	// Highlight active navItems, including `#hash` links via `useActiveSection`.
	const navItemsWithActive = useNavItemsWithActive(navItems)

	// Render a generic list of `SideBarNavMenuItem`
	return (
		<ul className={s.listResetStyles}>
			{navItemsWithActive.map((item: OpenApiNavItem, index: number) => (
				// eslint-disable-next-line react/no-array-index-key
				<SidebarNavMenuItem item={item} key={index} />
			))}
		</ul>
	)
}
