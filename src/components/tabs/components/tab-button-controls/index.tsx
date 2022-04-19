import { KeyboardEvent, useEffect, useRef } from 'react'
import classNames from 'classnames'
import { TabControlsProps, TabItem } from '../../types'
import newIndexFromKeypress from '../../helpers/new-index-from-keypress'
import s from './tab-button-controls.module.css'

function TabButtonControls({
  tabItems,
  activeTabIndex,
  setActiveTabIndex,
  ariaLabel,
  ariaLabelledBy,
}: TabControlsProps) {
  // After keydown events, we want to focus the active "tab" button element.
  const wasKeypress = useRef<boolean>(false)
  const buttonElements = useRef<{ [key in string]: HTMLButtonElement }>({})

  /**
   * After a keypress event, focus the newly active tab button.
   * Note: keyUp events don't repeat, but keyDown ones do.
   * We don't want a long hold of the left or right arrow keys to
   * rapidly change the active tab. So, we use keyUp here.
   *
   * This is based on the implementation at:
   * https://www.w3.org/TR/wai-aria-practices-1.2/examples/tabs/tabs-1/tabs.html
   */
  useEffect(() => {
    if (wasKeypress.current) {
      const focusTarget = buttonElements.current[activeTabIndex]
      focusTarget?.focus()
      wasKeypress.current = false
    }
  }, [activeTabIndex])

  return (
    <div
      aria-label={!ariaLabelledBy ? ariaLabel : undefined}
      aria-labelledby={ariaLabelledBy}
      className={s.tabList}
      role="tablist"
      onKeyUp={(e: KeyboardEvent<HTMLDivElement>) => {
        const newIndex = newIndexFromKeypress(
          e.key,
          activeTabIndex,
          tabItems.length
        )
        if (newIndex !== activeTabIndex) {
          wasKeypress.current = true
          setActiveTabIndex(newIndex)
        }
      }}
    >
      {tabItems.map((tabItem: TabItem, index: number) => {
        const { label, tabId, panelId, isActive } = tabItem
        return (
          <button
            className={classNames(s.tabButton, 'g-focus-ring-from-box-shadow')}
            aria-controls={panelId}
            aria-selected={isActive}
            id={tabId}
            key={tabId}
            onClick={() => setActiveTabIndex(index)}
            ref={(element: HTMLButtonElement) =>
              (buttonElements.current[index] = element)
            }
            role="tab"
            tabIndex={isActive ? 0 : -1}
            type="button"
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

export default TabButtonControls
