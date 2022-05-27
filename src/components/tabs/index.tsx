import { ReactElement, useState } from 'react'
import classNames from 'classnames'
import { Tab, TabButtonControls, TabDropdownControls } from './components'
import { useOverflowRef, useTabItems, useSyncedTabGroups } from './hooks'
import { TabItem, TabsProps } from './types'
import s from './tabs.module.css'

const Tabs = ({
  ariaLabel,
  ariaLabelledBy,
  children,
  initialActiveIndex = 0,
  showAnchorLine = true,
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
   * Track whether tabs are overflowing, so we can switch to a select.
   */
  const [hasOverflow, overflowRef] = useOverflowRef<HTMLDivElement>()

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
   * useSyncedTabGroups hooks into TabProvider,
   * and keeps activeTabIndex & activeTabGroup in sync.
   *
   * Note: only works where tabs have groups, eg <Tab group="some-string" />.
   */
  const setSyncedActiveTabIndex = useSyncedTabGroups({
    activeTabIndex,
    setActiveTabIndex,
    tabItems,
  })

  /**
   * If there's overflow, show a dropdown. Otherwise show typical tabs.
   * TODO: current TabDropdownControls is temporary, and will be redone later.
   * Task to replace TabDropdownControls:
   * https://app.asana.com/0/1202097197789424/1202133172981709/f
   */
  const TabControls = hasOverflow ? TabDropdownControls : TabButtonControls

  return (
    <div ref={overflowRef}>
      <div
        className={classNames(s.tabControls, {
          [s.showAnchorLine]: showAnchorLine,
        })}
      >
        <TabControls
          ariaLabel={ariaLabel}
          ariaLabelledBy={ariaLabelledBy}
          tabItems={tabItems}
          activeTabIndex={activeTabIndex}
          setActiveTabIndex={setSyncedActiveTabIndex}
        />
      </div>
      {tabItems.map((tabItem: TabItem) => {
        const { content, tabId, panelId, isActive } = tabItem
        const TabContent = () => <>{content}</>
        return (
          <div
            className={s.tabPanel}
            aria-hidden={!isActive}
            aria-labelledby={tabId}
            id={panelId}
            key={panelId}
            role="tabpanel"
            tabIndex={0}
          >
            <TabContent />
          </div>
        )
      })}
    </div>
  )
}

export default Tabs
export { Tab }
