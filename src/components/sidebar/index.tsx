// Third-party imports
import { ReactElement, useMemo, useState } from 'react'
import classNames from 'classnames'

// Global imports
import useCurrentPath from 'hooks/use-current-path'
import { useCurrentProduct } from 'contexts'
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
import SidebarFilterInput from './components/sidebar-filter-input'
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
				<SidebarFilterInput value={filterValue} onChange={setFilterValue} />
			</div>
		)
	}

	/**
	 * TODO: before adding an overview item,
	 * automatically detect whether it is needed.
	 *
	 * If the `children` prop is being used, then we skip
	 * trying to figure out if a duplicate `overviewItemHref` item
	 * is being rendered.
	 * TODO: confirm the above makes sense based on use of `children`.
	 *
	 * Else, with `children` not being used, we'll use `menuItems`.
	 * We can detect if an overview item already exists by
	 * filtering out the top level items in `menuItems`, and seeing
	 * if there are any items that match `overviewItemHref`.
	 * If there is such a match, we won't add an "Overview" item,
	 * since it would likely be duplicative.
	 * If there is no such match, we'll add an "Overview" item with
	 * the provided `overviewItemHref`.
	 * TODO: implement the above.
	 *
	 * Notes:
	 * The `children` prop is provided in the following scenarios:
	 * - ...
	 * TODO: list where `children` is used, tutorials I think?
	 * The `menuItems` prop is provided in the following scenarios:
	 * - ...
	 * TODO: list where `menuItems` is used, mainly docs I think?
	 */
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
				{filteredMenuItems.map((item: FilteredNavItem) => (
					<SidebarNavMenuItem item={item} key={item.id} />
				))}
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
