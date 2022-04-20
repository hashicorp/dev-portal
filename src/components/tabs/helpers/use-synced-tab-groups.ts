import { useEffect, useState } from 'react'
import { TabItem } from '../types'
import { useTabGroups } from '../provider'

/**
 * Uses context from TabProvider,
 * as well as the provided setActiveTabIndex,
 * to keep activeTabIndex in sync with activeTabGroup.
 *
 * Figures out how to map tab indexes to tab groups
 * from the provided tabItems.
 */
function useSyncedTabGroups({
  activeTabIndex,
  setActiveTabIndex,
  tabItems,
}: {
  activeTabIndex: number
  setActiveTabIndex: $TSFixMe
  tabItems: TabItem[]
}): void {
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
   * Create a mapping between tabIndex & tabGroup values.
   * This mapping only needs to be updated when tabItems change.
   * We'll use this mapping to keep activeTabGroup & activeTabIndex in sync.
   */
  type TabGroupToIndex = Record<string, number>
  const [tabGroupToIndex, setTabGroupToIndex] = useState<TabGroupToIndex>({})
  useEffect(() => {
    // Create the group => index map
    setTabGroupToIndex(
      tabItems.reduce(
        (acc: TabGroupToIndex, { group }: TabItem, index: number) => {
          // Spread acc at the end, so that the first matched tab is used
          return { ...{ [group]: index }, ...acc }
        },
        {}
      )
    )
  }, [tabItems])

  /**
   * When the activeTabGroup changes, setActiveTabIndex, if it makes sense
   *
   * It makes sense to sync these if there is a tab.group => tabIndex mapping
   * for the current tabGroup. If there is such a mapping, and if the current
   * activeTabIndex does not match, then we call setActiveTabIndex.
   */
  const { activeTabGroup } = tabGroupContext || {}
  useEffect(() => {
    if (activeTabGroup) {
      const targetIndex = tabGroupToIndex[activeTabGroup]
      if (typeof targetIndex == 'number' && activeTabIndex !== targetIndex) {
        setActiveTabIndex(targetIndex)
      }
    }
    // Note: adding activeTabIndex as a dependency causes an infinite loop.
    // We want this effect to focus on whether activeTabGroup has changed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTabGroup, tabGroupToIndex])

  /**
   * When activeTabIndex changes, setActiveTabGroup if it makes sense
   *
   * It makes sense to sync these if there is a tabIndex => tab.group mapping
   * for the current activeTabIndex. If there is such a mapping, and if
   * the current activeTabGroup does not match, then we call setActiveTabGroup.
   */
  useEffect(() => {
    if (tabGroupContext) {
      const { activeTabGroup, setActiveTabGroup } = tabGroupContext
      const targetGroup = tabItems[activeTabIndex]?.group
      if (typeof targetGroup == 'string' && activeTabGroup !== targetGroup) {
        setActiveTabGroup(targetGroup)
      }
    }
    // Note: adding tabGroupContext as a dependency causes an infinite loop.
    // We want this effect to focus on whether activeTabIndex has changed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTabIndex, tabItems])
}

export default useSyncedTabGroups
