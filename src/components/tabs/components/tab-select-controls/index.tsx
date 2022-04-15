import { IconCaret16 } from '@hashicorp/flight-icons/svg-react/caret-16'
import { TabControlsProps, TabItem } from '../../types'
import s from './tab-select-controls.module.css'

/**
 * TODO: current TabSelectControls is temporary, and will be redone later.
 * Task to replace TabSelectControls:
 * https://app.asana.com/0/1202097197789424/1202133172981709/f
 */
function TabSelectControls({
  ariaLabel = 'Select a tab panel',
  ariaLabelledBy,
  activeTabIndex,
  tabItems,
  setActiveTabIndex,
}: TabControlsProps) {
  return (
    <div className={s.selectRoot}>
      <select
        aria-label={!ariaLabelledBy ? ariaLabel : undefined}
        aria-labelledby={ariaLabelledBy}
        className={s.select}
        onChange={(e) => setActiveTabIndex(parseInt(e.target.value))}
        value={activeTabIndex}
      >
        {tabItems.map((item: TabItem, index: number) => {
          const { isActive, tabId, label, panelId } = item
          return (
            <option
              key={tabId}
              className={s.option}
              id={tabId}
              value={index}
              aria-label={label}
              selected={isActive}
              aria-controls={panelId}
            >
              {label}
            </option>
          )
        })}
      </select>
      <span className={s.selectTrailingIcon}>
        <IconCaret16 />
      </span>
    </div>
  )
}

export default TabSelectControls
