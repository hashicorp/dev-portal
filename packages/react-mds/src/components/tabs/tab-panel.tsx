import { useId, useMemo, type HTMLAttributes } from 'react'
import classNames from 'classnames'
import { useTabsContext } from './use-tabs-context'
import s from './tabs.module.scss'

type TabPanelProps = HTMLAttributes<HTMLDivElement>

const TabPanel = ({ children, className, ...rest }: TabPanelProps) => {
	const { panelIds, tabIds, selectedTabIndex, panelNodes } = useTabsContext()
	const panelId = 'panel-' + useId()

	const nodeIndex = useMemo(
		() => panelIds.indexOf(panelId),
		[panelIds, panelId]
	)

	const tabId = useMemo(
		() => (nodeIndex > -1 ? tabIds[nodeIndex] : undefined),
		[tabIds, nodeIndex]
	)

	const isSelected = useMemo(
		() => nodeIndex === selectedTabIndex,
		[nodeIndex, selectedTabIndex]
	)

	return (
		<section
			className={classNames(s.panel, className)}
			{...rest}
			role="tabpanel"
			aria-labelledby={tabId}
			id={panelId}
			hidden={!isSelected}
			ref={(el: HTMLDivElement) => panelNodes.current.push(el)}
		>
			{children}
		</section>
	)
}

export type { TabPanelProps }
export { TabPanel }
