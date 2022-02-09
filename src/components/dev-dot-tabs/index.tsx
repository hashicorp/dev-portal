import { ReactElement, ReactNode } from 'react'

interface DevDotTabsProps {
  tabs: {
    content: ReactNode
    id: string
    label: string
  }[]
}

const DevDotTabs = ({ tabs }: DevDotTabsProps): ReactElement => {
  return (
    <div>
      {/* TODO: label prop? or aria-labelledby? either/or?*/}
      <div role="tablist">
        {tabs.map((tab, index) => {
          // TODO: also check the upcoming activeIndex prop
          const isActive = index === 0

          return (
            <button
              aria-controls={`${tab.id}-tabpanel`}
              aria-selected={isActive}
              id={`${tab.id}-tab`}
              key={tab.id}
              role="tab"
              tabIndex={isActive ? 0 : -1}
              type="button"
            >
              {tab.label}
            </button>
          )
        })}
      </div>
      {tabs.map((tab) => (
        <div
          aria-labelledby={`${tab.id}-tab`}
          id={`${tab.id}-tabpanel`}
          key={tab.id}
          tabIndex={0}
        >
          {tab.content}
        </div>
      ))}
    </div>
  )
}

export default DevDotTabs
