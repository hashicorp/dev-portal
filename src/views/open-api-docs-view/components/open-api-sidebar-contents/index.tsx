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
	navResourceItems,
	showFilterInput = true,
}: {
	navItems: OpenApiNavItem[]
	navResourceItems: OpenApiNavItem[]
	showFilterInput: boolean
}) {
	const [filterValue, setFilterValue] = useState('')

	// Highlight active navItems, including `#hash` links via `useActiveSection`.
	const navItemsWithActive = useNavItemsWithActive(navItems, filterValue === '')

	// Filter navItems by `filterValue`
	const filteredNavItems = filterByTitle(navItemsWithActive, filterValue)

	// Render a generic list of `SideBarNavMenuItem`
	return (
		<>
			<div className={s.filterAndNav}>
				{showFilterInput ? (
					<FilterInput
						value={filterValue}
						onChange={setFilterValue}
						placeholder="Filter sidebar"
					/>
				) : null}
				<SidebarNavMenuItemsList items={filteredNavItems} />
			</div>
			{/* Render resources, if present */}
			{navResourceItems?.length > 0 ? (
				<SidebarNavMenuItemsList
					items={[
						{ divider: true },
						{ heading: 'Resources' },
						...navResourceItems,
					]}
				/>
			) : null}
		</>
	)
}

/**
 * Renders an unordered list of nav items, with list styles reset.
 */
function SidebarNavMenuItemsList({ items }: { items: OpenApiNavItem[] }) {
	return (
		<ul className={s.listResetStyles}>
			{items.map((item: OpenApiNavItem, index: number) => (
				// eslint-disable-next-line react/no-array-index-key
				<SidebarNavMenuItem item={item} key={index} />
			))}
		</ul>
	)
}
