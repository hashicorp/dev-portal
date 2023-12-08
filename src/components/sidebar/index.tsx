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
import { FilteredNavItem, MenuItem, SidebarProps } from './types'
import {
	addNavItemMetaData,
	getFilteredNavItems,
	generateResourcesNavItems,
} from './helpers'
import SidebarNavList from './components/sidebar-nav-list'
import SidebarBackToLink from './components/sidebar-back-to-link'
import SidebarMobileControls from './components/sidebar-mobile-controls'
import s from './sidebar.module.css'
import OpenApiSidebarContents from 'components/open-api-sidebar-contents'
import { OpenApiNavItem } from 'views/open-api-docs-view/types'

const Sidebar = ({
	backToLinkProps,
	children,
	levelButtonProps,
	menuItems,
	overviewItemHref,
	showFilterInput = true,
	title,
	visuallyHideTitle = false,
	isInstallPage,
	showResourcesList = true,
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
	const filteredMenuItems = getFilteredNavItems(itemsWithMetadata, filterValue)
	const navResourceItems = generateResourcesNavItems(currentProduct?.slug).map(
		(item) => item
	)
	if (children) {
		sidebarContent = children
	} else if (isInstallPage) {
		sidebarContent = (
			<OpenApiSidebarContents
				navItems={filteredMenuItems as unknown as OpenApiNavItem[]}
				navResourceItems={navResourceItems.splice(1)}
				showFilterInput={false}
			/>
		)
	} else {
		let resourcesList
		if (showResourcesList) {
			resourcesList = (
				<>
					<SidebarHorizontalRule />
					<SidebarNavList>
						{navResourceItems.map((item, index) => (
							// eslint-disable-next-line react/no-array-index-key
							<SidebarNavMenuItem item={item} key={index} />
						))}
					</SidebarNavList>
				</>
			)
		}

		sidebarContent = (
			<>
				<SidebarNavList>
					{filteredMenuItems.map((item: FilteredNavItem, i) => {
						const key = `${item.id}-${i}`
						return <SidebarNavMenuItem item={item} key={key} />
					})}
				</SidebarNavList>
				{resourcesList}
			</>
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
			</nav>
		</div>
	)
}

export type { MenuItem, SidebarProps }
export default Sidebar
