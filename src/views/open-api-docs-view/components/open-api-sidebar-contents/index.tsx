/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party
import { useState } from 'react'
// Components
import { SidebarNavMenuItem } from 'components/sidebar/components'
// Utils
import { useNavItemsWithActive } from './utils/use-nav-items-with-active'
// Types
import type {
	OpenApiNavItem,
	LinkNavItem,
} from 'views/open-api-docs-view/types'
// Styles
import s from './open-api-sidebar-contents.module.css'
import FilterInput from 'components/filter-input'
import { filterFlatNavItems } from 'components/sidebar/helpers/get-filtered-nav-items'

/**
 * Renders sidebar contents for OpenApiDocsView.
 */
export function OpenApiSidebarContents({
	navItems,
}: {
	navItems: OpenApiNavItem[]
}) {
	const [filterValue, setFilterValue] = useState('')

	// Highlight active navItems, including `#hash` links via `useActiveSection`.
	const navItemsWithActive = useNavItemsWithActive(navItems)

	// Filter navItems by `filterValue`
	const filteredNavItems = filterFlatNavItems<LinkNavItem, OpenApiNavItem>(
		navItemsWithActive,
		filterValue
	)

	// Render a generic list of `SideBarNavMenuItem`
	return (
		<div className={s.root}>
			<FilterInput
				value={filterValue}
				onChange={setFilterValue}
				placeholder="Filter sidebar"
			/>
			{/* Thought: could split this out, like `SidebarNavMenuItemsList` */}
			<ul className={s.listResetStyles}>
				{filteredNavItems.map((item: OpenApiNavItem, index: number) => (
					// eslint-disable-next-line react/no-array-index-key
					<SidebarNavMenuItem item={item} key={index} />
				))}
			</ul>
			{/* TODO: add resources section here, will likely include `SidebarNavMenuItemsList` */}
		</div>
	)
}
