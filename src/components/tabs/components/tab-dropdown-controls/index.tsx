import classNames from 'classnames'
import { IconCaret16 } from '@hashicorp/flight-icons/svg-react/caret-16'
import { TabControlsProps, TabItem } from '../../types'
import s from './tab-dropdown-controls.module.css'

/**
 * TODO: current TabDropdownControls is temporary, and will be redone later.
 * Task to replace TabDropdownControls:
 * https://app.asana.com/0/1202097197789424/1202133172981709/f
 */
function TabDropdownControls({
	activeTabIndex,
	ariaLabel = 'Select a tab panel',
	ariaLabelledBy,
	isNested,
	setActiveTabIndex,
	tabItems,
}: TabControlsProps) {
	const currentTabItem = tabItems[activeTabIndex]
	const hasIcon = !!currentTabItem.icon

	return (
		<div
			className={classNames(s.selectRoot, {
				[s.isNested]: isNested,
			})}
		>
			{hasIcon ? (
				<span className={s.leadingIcon}>{currentTabItem.icon}</span>
			) : null}
			<select
				aria-label={!ariaLabelledBy ? ariaLabel : undefined}
				aria-labelledby={ariaLabelledBy}
				className={classNames(s.select, {
					[s.isNested]: isNested,
					[s.hasIcon]: hasIcon,
				})}
				onChange={(e) => setActiveTabIndex(parseInt(e.target.value))}
				value={activeTabIndex}
			>
				{tabItems.map((item: TabItem, index: number) => {
					const { label, tabId } = item
					return (
						<option
							key={tabId}
							className={s.option}
							id={tabId}
							value={index}
							aria-label={label}
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

export { TabDropdownControls }
