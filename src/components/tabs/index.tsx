import { ReactElement, useState } from 'react'
import TabPanel from './components/tab'
import { TabsProps } from './types'

const Tabs = ({
  ariaLabel,
  ariaLabelledBy,
  initialActiveIndex = 0,
  children,
}: TabsProps): ReactElement => {
  const [activeTabIndex, setActiveTabIndex] = useState<number>(
    initialActiveIndex
  )

  if (!Array.isArray(children)) {
    throw new Error('children must be an array of Tab components')
  }

  return (
    <div>
      <div
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        role="tablist"
      >
        {children.map((childTab: ReactElement, index) => {
          const { id, heading } = childTab.props
          const isActive = index === activeTabIndex

          return (
            <button
              aria-controls={`${id}-tabpanel`}
              aria-selected={isActive}
              id={`${id}-tab`}
              key={id}
              onClick={() => setActiveTabIndex(index)}
              role="tab"
              tabIndex={isActive ? 0 : -1}
              type="button"
            >
              {heading}
            </button>
          )
        })}
      </div>
      {children.map((childTab: ReactElement, index) => {
        const { id, children } = childTab.props
        const isActive = index === activeTabIndex

        return (
          <div
            aria-labelledby={`${id}-tab`}
            id={`${id}-tabpanel`}
            key={id}
            style={{ display: isActive ? 'block' : 'none' }}
            role="tabpanel"
            tabIndex={0}
          >
            {children}
          </div>
        )
      })}
    </div>
  )
}

export default Tabs
export { TabPanel }
