import { useCallback, useEffect } from 'react'
import { TabItem } from '../types'
import { useTabGroups } from '../provider'

/**
 * Uses context from `TabProvider` and the given `setActiveTabIndex` to keep
 * `activeTabIndex` in sync with `activeTabGroup`. Figures out how to map tab
 * indices to tab groups by using the provided `tabItems`.
 */
function useSyncedTabGroups({
	activeTabIndex,
	setActiveTabIndex,
	tabItems,
}: {
	activeTabIndex: number
	setActiveTabIndex: (activeTabIndex: number) => void
	tabItems: TabItem[]
}): (activeTabIndex: number) => void {
	/**
	 * Pull active tab group data from TabProvider.
	 */
	const tabContext = useTabGroups()

	/**
	 * Set up a side effect that checks if the active tab index and active tab
	 * group need to be synced.
	 */
	useEffect(() => {
		// If there is no active tab group or tabContext, don't do anything
		if (!tabContext || !tabContext.activeTabGroup) {
			return
		}

		// Check if the current tab is part of the active group
		const currentTabItem = tabItems[activeTabIndex]
		if (currentTabItem.group !== tabContext.activeTabGroup) {
			// Look for a tab that matches the active group
			tabItems.find((tabItem: TabItem, index: number) => {
				// Update the active index if a tab that matches the group was found
				if (tabItem.group === tabContext.activeTabGroup) {
					setActiveTabIndex(index)
				}
			})
		}
	}, [activeTabIndex, setActiveTabIndex, tabContext, tabItems])

	/**
	 * Create a callback for updating the active tab index that will automatically
	 * handle syncing the active index and the active tab group.
	 */
	const setSyncedActiveTabIndex = useCallback(
		(newIndex: number) => {
			const tabItem = tabItems[newIndex]
			tabContext?.setActiveTabGroup(tabItem.group)
			setActiveTabIndex(newIndex)
		},
		[setActiveTabIndex, tabContext, tabItems]
	)

	return setSyncedActiveTabIndex
}

export default useSyncedTabGroups
