import { ReactElement, useEffect, useState } from 'react'
import classNames from 'classnames'
import { Tab, TabButtonControls, TabDropdownControls } from './components'
import { useHasOverflow, useTabItems } from './hooks'
import { TabItem, TabsProps } from './types'
import TabNestingProvider, { useIsNested } from './helpers/tab-nesting-context'
import { useTabGroups } from './provider'
import s from './tabs.module.css'

const Tabs = ({
	ariaLabel,
	ariaLabelledBy,
	children,
	initialActiveIndex = 0,
	showAnchorLine = true,
	allowNestedStyles = false,
}: TabsProps): ReactElement => {
	/**
	 * TODO: this is a temporary measure until we are able to start requiring
	 * either (but not both) of these properties via TypeScript. See the block
	 * comment in `./types.ts` for context.
	 */
	if (ariaLabel && ariaLabelledBy) {
		throw new Error(
			'Both ariaLabel and ariaLabelledBy provided to Tabs component. Please only provide one.'
		)
	}

	/**
	 * Track tab nesting level, for styling purposes
	 */
	const isNested = useIsNested()

	/**
	 * Track whether tabs are overflowing, so we can switch to a select.
	 */
	const [hasOverflow, overflowTargetRef] = useHasOverflow<HTMLDivElement>()

	/**
	 * Track the active tab
	 */
	const [activeTabIndex, setActiveTabIndex] =
		useState<number>(initialActiveIndex)

	/**
	 * useTabItems efficiently handles validation & activation of tabItems
	 */
	const tabItems = useTabItems({ children, activeTabIndex, initialActiveIndex })

	/**
	 * Handle syncing `activeTabIndex` and `activeTabGroup`.
	 *
	 * Note: only works where tabs have groups, eg <Tab group="some-string" />.
	 */
	const { activeTabGroup, setActiveTabGroup } = useTabGroups()
	useEffect(() => {
		// If there is no active tab group, don't do anything
		if (!activeTabGroup) {
			return
		}

		// Check if the current tab is part of the active group
		const currentTabItem = tabItems[activeTabIndex]
		if (currentTabItem.group !== activeTabGroup) {
			// Look for a tab that matches the active group
			tabItems.find((tabItem, index) => {
				// Update the active index if a tab that matches the group was found
				if (tabItem.group === activeTabGroup) {
					setActiveTabIndex(index)
				}
			})
		}
	}, [activeTabGroup, activeTabIndex, tabItems])

	/**
	 * If there's overflow, show a dropdown. Otherwise show typical tabs.
	 * TODO: current TabDropdownControls is temporary, and will be redone later.
	 * Task to replace TabDropdownControls:
	 * https://app.asana.com/0/1202097197789424/1202133172981709/f
	 */
	const TabControls = hasOverflow ? TabDropdownControls : TabButtonControls

	return (
		<TabNestingProvider>
			<div ref={overflowTargetRef}>
				<div
					className={classNames(s.tabControls, {
						[s.isCheckingOverflow]: hasOverflow === null,
						[s.showAnchorLine]: showAnchorLine,
						[s.allowNestedStyles]: allowNestedStyles,
					})}
				>
					<TabControls
						ariaLabel={ariaLabel}
						ariaLabelledBy={ariaLabelledBy}
						tabItems={tabItems}
						activeTabIndex={activeTabIndex}
						setActiveTabIndex={(newIndex) => {
							const tabItem = tabItems[newIndex]
							setActiveTabGroup(tabItem.group)
							setActiveTabIndex(newIndex)
						}}
						isNested={allowNestedStyles && isNested}
					/>
				</div>
				{tabItems.map((tabItem: TabItem) => {
					const { content, tabId, panelId, isActive } = tabItem
					return (
						<div
							aria-hidden={!isActive}
							aria-labelledby={tabId}
							className={classNames(
								s.tabPanel,
								'g-focus-ring-from-box-shadow',
								{
									[s.isNested]: isNested,
									[s.allowNestedStyles]: allowNestedStyles,
								}
							)}
							id={panelId}
							key={panelId}
							role="tabpanel"
							tabIndex={0}
						>
							{content}
						</div>
					)
				})}
			</div>
		</TabNestingProvider>
	)
}

export default Tabs
export { Tab }
