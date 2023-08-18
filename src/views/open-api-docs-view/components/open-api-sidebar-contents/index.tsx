/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party
import { useState } from 'react'
// Components
import FilterInput from 'components/filter-input'
import { SidebarNavMenuItem } from 'components/sidebar/components'
// Utils
import { useNavItemsWithActive } from './utils/use-nav-items-with-active'
import { filterByTitle } from './utils/filter-by-title'
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
	const [filterValue, setFilterValue] = useState('')

	// Highlight active navItems, including `#hash` links via `useActiveSection`.
	const navItemsWithActive = useNavItemsWithActive(navItems, filterValue === '')

	// Filter navItems by `filterValue`
	const filteredNavItems = filterByTitle(navItemsWithActive, filterValue)

	// Render a generic list of `SideBarNavMenuItem`
	return (
		<div className={s.filterAndNav}>
			<FilterInput
				value={filterValue}
				onChange={setFilterValue}
				placeholder="Filter sidebar"
			/>
			<ul className={s.listResetStyles}>
				{filteredNavItems.map((item: OpenApiNavItem, index: number) => (
					// eslint-disable-next-line react/no-array-index-key
					<SidebarNavMenuItem item={item} key={index} />
				))}
			</ul>
		</div>
	)
}
