import classNames from 'classnames'
import { BadgeCount } from '../badge-count'
import { useId, type HTMLAttributes, useMemo } from 'react'
import { useTabsContext } from './use-tabs-context'
import { FlightIcon, FlightIconName } from '../flight-icon'
import s from './tabs.module.scss'

interface TabProps extends HTMLAttributes<HTMLLIElement> {
	tabIndicatorTheme?: 'primary' | 'secondary'
	/**
	 * Displays a count indicator in the tab. Accepts the text value that should go in Badge Count. (optional)
	 */
	count?: string
	/**
	 * Displays an icon in the tab. (optional)
	 */
	icon?: FlightIconName
	/**
	 * Customizes the initial tab to display when the page is loaded. The first tab is selected on page load by default. (optional)
	 */
	isSelected?: boolean
	/**
	 * Used to append analytics and tracking related data attributes to any interactive element internal to this component.
	 */
	trackingKey?: string
}

const Tab = ({
	count,
	icon,
	isSelected: isInitialTab,
	children,
	className,
	trackingKey,
	tabIndicatorTheme = 'primary',
	...rest
}: TabProps) => {
	const { tabNodes, tabIds, selectedTabIndex, onClick, onKeyUp, size } =
		useTabsContext()
	const tabId = 'tab-' + useId()

	const nodeIndex = useMemo(() => tabIds.indexOf(tabId), [tabIds, tabId])

	const isSelected = useMemo(
		() => nodeIndex === selectedTabIndex,
		[nodeIndex, selectedTabIndex]
	)

	return (
		<li
			className={classNames(
				s.tab,
				s[tabIndicatorTheme],
				{
					[s.selected]: isSelected,
				},
				className
			)}
			{...rest}
			role="presentation"
		>
			<button
				className={classNames(
					s['tab-button'],
					'mds-typography-font-weight-medium',
					{
						['token-typography-body-200']: size === 'medium',
						['token-typography-body-300']: size === 'large',
					}
				)}
				role="tab"
				type="button"
				id={tabId}
				aria-selected={isSelected}
				tabIndex={!isSelected ? -1 : undefined}
				onClick={(e) => onClick(nodeIndex, e)}
				onKeyUp={(e) => onKeyUp(nodeIndex, e)}
				data-is-selected={isInitialTab}
				data-analytics={trackingKey}
				ref={(el: HTMLButtonElement) => tabNodes.current.push(el)}
			>
				{icon && <FlightIcon name={icon} size={16} role="presentation" />}

				{children}

				{count && <BadgeCount text={count} size="small" role="presentation" />}
			</button>
		</li>
	)
}

export type { TabProps }
export { Tab }
