import { KeyboardEvent, useEffect, useRef } from 'react'
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
   * Note: MDN example uses keydown, not keyup, though not sure how
   * much stock we should place in that:
   * https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Tab_Role#example
   * Our tests currently rely on onKeyUp being used, NOT onKeydown.
   * Switching to onKeydown would require refactoring tests.
   * I need to get some more context on why we use keyup rather than keydown.
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
            className={s.tabButton}
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
