import { ReactElement, useState } from 'react'
import { TabsProps } from './types'

const Tabs = ({
  ariaLabel,
  ariaLabelledBy,
  initialActiveIndex = 0,
  tabs,
}: TabsProps): ReactElement => {
  const [activeTabIndex, setActiveTabIndex] = useState<number>(
    initialActiveIndex
  )

  return (
    <div>
      <div
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        role="tablist"
      >
        {tabs.map((tab, index) => {
          // TODO: also check the upcoming activeIndex prop
          const isActive = index === activeTabIndex

          return (
            <button
              aria-controls={`${tab.id}-tabpanel`}
              aria-selected={isActive}
              id={`${tab.id}-tab`}
              key={tab.id}
              onClick={() => setActiveTabIndex(index)}
              role="tab"
              tabIndex={isActive ? 0 : -1}
              type="button"
            >
              {tab.label}
            </button>
          )
        })}
      </div>
      {tabs.map((tab, index) => {
        const isActive = index === activeTabIndex

        return (
          <div
            aria-labelledby={`${tab.id}-tab`}
            id={`${tab.id}-tabpanel`}
            key={tab.id}
            style={{ display: isActive ? 'block' : 'none' }}
            role="tabpanel"
            tabIndex={0}
          >
            {tab.content}
          </div>
        )
      })}
    </div>
  )
}

export default Tabs
