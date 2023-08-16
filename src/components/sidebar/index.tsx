/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party imports
import { ReactElement, useMemo, useState } from 'react'
import classNames from 'classnames'

// Global imports
import { SIDEBAR_LABEL_ID, SIDEBAR_NAV_ELEMENT_ID } from 'constants/element-ids'
import useCurrentPath from 'hooks/use-current-path'
import { useCurrentProduct } from 'contexts'
import FilterInput from 'components/filter-input'
import { useSidebarNavData } from 'layouts/sidebar-sidecar/contexts/sidebar-nav-data'
import {
	SidebarHorizontalRule,
	SidebarNavLinkItem,
	SidebarNavMenuItem,
	SidebarSkipToMainContent,
	SidebarTitleHeading,
} from 'components/sidebar/components'

// Local imports
import {
	LinkNavItemWithMetaData,
	MenuItem,
	SidebarProps,
	SubmenuNavItemWithMetaData,
} from './types'
import {
	addNavItemMetaData,
	filterNestedNavItems,
	generateResourcesNavItems,
} from './helpers'
import SidebarNavList from './components/sidebar-nav-list'
import SidebarBackToLink from './components/sidebar-back-to-link'
import SidebarMobileControls from './components/sidebar-mobile-controls'
import s from './sidebar.module.css'

const Sidebar = ({
	backToLinkProps,
	children,
	levelButtonProps,
	menuItems,
	overviewItemHref,
	showFilterInput = true,
	title,
	visuallyHideTitle = false,
}: SidebarProps): ReactElement => {
	const currentProduct = useCurrentProduct()
	const { shouldRenderMobileControls } = useSidebarNavData()
	const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
	const [filterValue, setFilterValue] = useState('')
	const { itemsWithMetadata } = useMemo(
		() => addNavItemMetaData(currentPath, menuItems),
		[currentPath, menuItems]
	)

	let backToElement
	if (shouldRenderMobileControls && levelButtonProps) {
		backToElement = (
			<SidebarMobileControls
				levelUpButtonText={levelButtonProps.levelUpButtonText}
				levelDownButtonText={levelButtonProps.levelDownButtonText}
			/>
		)
	} else if (backToLinkProps) {
		const { text, href } = backToLinkProps
		backToElement = (
			<div className={s.backToLinkWrapper}>
				<SidebarBackToLink text={text} href={href} />
			</div>
		)
	}

	let sidebarFilterInput
	if (showFilterInput) {
		sidebarFilterInput = (
			<div
				className={classNames(s.filterInputWrapper, {
					[s['filterInputWrapper--mobile']]: shouldRenderMobileControls,
				})}
			>
				<FilterInput
					value={filterValue}
					onChange={setFilterValue}
					placeholder="Filter sidebar"
				/>
			</div>
		)
	}

	let overviewItem
	if (overviewItemHref && !filterValue) {
		overviewItem = (
			<SidebarNavLinkItem
				item={{
					href: overviewItemHref,
					title: 'Overview',
					isActive: overviewItemHref === currentPath,
				}}
			/>
		)
	}

	let sidebarContent
	if (children) {
		sidebarContent = children
	} else {
		const filteredMenuItems =
			filterValue && filterValue !== ''
				? filterNestedNavItems<
						LinkNavItemWithMetaData,
						SubmenuNavItemWithMetaData
				  >(itemsWithMetadata, filterValue)
				: itemsWithMetadata
		sidebarContent = (
			<SidebarNavList>
				{filteredMenuItems.map((item, i) => {
					/**
					 * TODO: these IDs were never guaranteed unique, it doesn't
					 * exactly matter because the interactivity is filtering and
					 * all filtered items do have `id` values, but this would be
					 * nice to fix and clarify as part of `MenuItem` cleanup.
					 */
					const itemId = 'id' in item ? item.id : 'divider-or-heading'
					const key = `${itemId}-${i}`
					return <SidebarNavMenuItem item={item} key={key} />
				})}
			</SidebarNavList>
		)
	}

	return (
		<div className={s.sidebar}>
			{backToElement}
			{sidebarFilterInput}
			<nav
				aria-labelledby={SIDEBAR_LABEL_ID}
				className={s.nav}
				id={SIDEBAR_NAV_ELEMENT_ID}
			>
				<div className={visuallyHideTitle ? 'g-screen-reader-only' : undefined}>
					<SidebarTitleHeading text={title} id={SIDEBAR_LABEL_ID} />
				</div>
				<SidebarSkipToMainContent />
				{overviewItem}
				{sidebarContent}
				<SidebarHorizontalRule />
				<SidebarNavList>
					{generateResourcesNavItems(currentProduct?.slug).map(
						(item, index) => (
							// eslint-disable-next-line react/no-array-index-key
							<SidebarNavMenuItem item={item} key={index} />
						)
					)}
				</SidebarNavList>
			</nav>
		</div>
	)
}

export type { MenuItem, SidebarProps }
export default Sidebar
