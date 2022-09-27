// Third-party imports
import { ReactElement, useMemo, useState } from 'react'
import classNames from 'classnames'

// Global imports
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

const SIDEBAR_LABEL_ID = 'sidebar-label'

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
		const filteredMenuItems = getFilteredNavItems(
			itemsWithMetadata,
			filterValue
		)
		sidebarContent = (
			<SidebarNavList>
				{filteredMenuItems.map((item: FilteredNavItem, i) => {
					const key = `${item.id}-${i}`
					return <SidebarNavMenuItem item={item} key={key} />
				})}
			</SidebarNavList>
		)
	}

	return (
		<div className={s.sidebar}>
			{backToElement}
			{sidebarFilterInput}
			<nav aria-labelledby={SIDEBAR_LABEL_ID} className={s.nav}>
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
