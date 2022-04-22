import { useEffect, useState } from 'react'
import { TabItem } from '../types'
import { useTabGroups } from '../provider'

/**
 * Uses context from TabProvider,
 * as well as the provided setActiveTabIndex,
 * to keep activeTabIndex in sync with activeTabGroup.
 *
 * Figures out how to map tab indexes to tab groups
 * by using the provided tabItems.
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
   * Use the tab group context
   */
  const tabGroupContext = useTabGroups()

  /**
   * In development, warn if a use of Tabs is trying to use groups,
   * but no TabProvider is available.
   */
  useEffect(() => {
    const hasGroupingIntent = tabItems.filter((i: TabItem) => i.group).length
    if (
      process.env.NODE_ENV !== 'production' &&
      hasGroupingIntent &&
      tabGroupContext === undefined
    ) {
      console.warn(
        'tabs issue: The `TabProvider` cannot be accessed. Make sure it wraps the `Tabs` components so Tab Groups can work properly.'
      )
    }
  }, [tabItems, tabGroupContext])

  /**
   * Create a mapping from tab.group => tabIndex values.
   * This mapping only needs to be updated when tabItems change.
   * We'll use this mapping to keep activeTabGroup in sync.
   * (Note the reverse mapping, tabIndex => tabGroup, is already available:
   * we can do tabItems[idx].group to achieve this mapping).
   */
  type TabGroupToIndex = Record<string, number>
  const [tabGroupToIndex, setTabGroupToIndex] = useState<TabGroupToIndex>({})
  useEffect(() => {
    // Create the group => index map
    setTabGroupToIndex(
      tabItems.reduce(
        (acc: TabGroupToIndex, { group }: TabItem, index: number) => {
          // Avoid adding "undefined" to the map
          if (typeof group != 'string') {
            return acc
          }
          // Spread acc at the end, so that the first matched tab is used
          return { ...{ [group]: index }, ...acc }
        },
        {}
      )
    )
  }, [tabItems])

  /**
   * When the activeTabGroup changes, call setActiveTabIndex, if it makes sense.
   *
   * It makes sense to call setActiveTabIndex if there is a
   * tab.group => tabIndex mapping for the current activeTabGroup,
   * and if the resulting target tab index is not already active.
   */
  useEffect(() => {
    if (tabGroupContext) {
      const { activeTabGroup } = tabGroupContext
      const targetIndex = tabGroupToIndex[activeTabGroup]
      if (typeof targetIndex == 'number' && activeTabIndex !== targetIndex) {
        setActiveTabIndex(targetIndex)
      }
    }
  }, [tabGroupContext, tabGroupToIndex, activeTabIndex, setActiveTabIndex])

  /**
   * Instead of calling setActiveTabIndex only,
   * we want to also call setActiveTabGroup if it makes sense.
   *
   * It makes sense to call setActiveTabGroup if there is a
   * tabIndex => tab.group mapping for the target activeTabIndex,
   * and if the expected activeTabGroup is not yet active.
   */
  function setSyncedActiveTabIndex(targetIndex: number): void {
    setActiveTabIndex(targetIndex)
    if (tabGroupContext) {
      const { activeTabGroup, setActiveTabGroup } = tabGroupContext
      const targetGroup = tabItems[targetIndex]?.group
      if (typeof targetGroup == 'string' && activeTabGroup !== targetGroup) {
        setActiveTabGroup(targetGroup)
      }
    }
  }

  return setSyncedActiveTabIndex
}

export default useSyncedTabGroups
