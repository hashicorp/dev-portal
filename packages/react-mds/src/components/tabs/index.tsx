import classNames from 'classnames'
import {
	type ReactNode,
	type HTMLAttributes,
	type KeyboardEvent,
	type MouseEvent,
	useState,
	useMemo,
	useRef,
	useEffect,
	useCallback,
} from 'react'
import { TabPanel } from './tab-panel'
import { Tab } from './tab'
import { TabsContext, useTabsContext } from './use-tabs-context'
import s from './tabs.module.scss'

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
	onClickTab?: (event: MouseEvent<HTMLButtonElement>, tabIndex: number) => void
	initialSelectedTabIndex?: number
	size?: 'medium' | 'large'
}

const Provider = ({
	children,
	onClickTab,
	initialSelectedTabIndex = 0,
	size = 'medium',
	className,
	...rest
}: TabsProps) => {
	const [selectedTabIndex, setSelectedTabIndex] = useState(
		initialSelectedTabIndex
	)
	const tabNodes = useRef<Array<HTMLButtonElement>>([])
	const panelNodes = useRef<Array<HTMLDivElement>>([])
	const [tabIds, setTabIds] = useState<Array<string>>([])
	const [panelIds, setPanelIds] = useState<Array<string>>([])
	const [indicatorWidth, setIndicatorWidth] = useState(0)
	const [indicatorLeftPosition, setIndicatorLeftPosition] = useState(0)
	const tabsListRef = useRef<HTMLUListElement | null>(null)

	const scrollIntoView = useCallback((tabIndex: number) => {
		// Scroll Tab into view if it's out of view
		const parentNode = tabNodes.current[tabIndex]
			?.parentNode as HTMLElement | null
		if (parentNode) {
			parentNode.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest',
				inline: 'nearest',
			})
		}
	}, [])

	useEffect(() => {
		setSelectedTabIndex(initialSelectedTabIndex)
	}, [initialSelectedTabIndex])

	useEffect(() => {
		const tabElem = tabNodes.current[selectedTabIndex]?.parentElement
		if (tabElem && tabsListRef.current) {
			const tabLeftPos = tabElem.offsetLeft
			const tabWidth = tabElem.offsetWidth
			setIndicatorLeftPosition(tabLeftPos)
			setIndicatorWidth(tabWidth)
			tabsListRef.current.scrollTo({
				left: tabLeftPos,
				behavior: 'smooth',
			})
		}
	}, [tabNodes, selectedTabIndex, scrollIntoView, tabsListRef])

	useEffect(() => {
		setTabIds(tabNodes.current.map((tab) => tab.id))
		let initialTabIndex = 0
		let selectedCount = 0

		tabNodes.current.forEach((tabElement, index) => {
			if (tabElement.hasAttribute('data-is-selected')) {
				initialTabIndex = index
				selectedCount++
			}
		})

		if (selectedCount > 1) {
			throw new Error('Only one tab may use isSelected argument')
		}

		setSelectedTabIndex(initialTabIndex)
	}, [tabNodes])

	useEffect(() => {
		setPanelIds(panelNodes.current.map((tab) => tab.id))
	}, [panelNodes])

	const onClick = useCallback(
		(tabIndex: number, event: MouseEvent<HTMLButtonElement>) => {
			setSelectedTabIndex(tabIndex)

			scrollIntoView(tabIndex)

			// invoke the callback function if it's provided as argument
			if (typeof onClickTab === 'function') {
				onClickTab(event, tabIndex)
			}
		},
		[onClickTab, scrollIntoView]
	)

	// Focus tab for keyboard & mouse navigation:
	const focusTab = useCallback(
		(tabIndex: number, e: KeyboardEvent<HTMLButtonElement>) => {
			e.preventDefault()
			tabNodes.current[tabIndex].focus()
		},
		[]
	)

	const onKeyUp = useCallback(
		(tabIndex: number, e: KeyboardEvent<HTMLButtonElement>) => {
			const leftArrow = 'ArrowLeft'
			const rightArrow = 'ArrowRight'
			const enterKey = 'Enter'
			const spaceKey = ' '

			if (e.key === rightArrow) {
				const nextTabIndex = (tabIndex + 1) % tabIds.length
				focusTab(nextTabIndex, e)
			} else if (e.key === leftArrow) {
				const prevTabIndex = (tabIndex + tabIds.length - 1) % tabIds.length
				focusTab(prevTabIndex, e)
			} else if (e.key === enterKey || e.key === spaceKey) {
				setSelectedTabIndex(tabIndex)
			}
		},
		[focusTab, tabIds.length]
	)

	const contextValue = useMemo(
		() => ({
			tabNodes,
			tabIds,
			panelNodes,
			panelIds,
			selectedTabIndex,
			onClick,
			onKeyUp,
			size,
			tabsListRef,
		}),
		[
			tabNodes,
			tabIds,
			panelNodes,
			panelIds,
			selectedTabIndex,
			onClick,
			onKeyUp,
			size,
			tabsListRef,
		]
	)

	return (
		<TabsContext.Provider value={contextValue}>
			<div
				className={classNames(s.tabs, className)}
				{...rest}
				style={{
					['--indicator-left-pos' as string]: `${indicatorLeftPosition}px`,
					['--indicator-width' as string]: `${indicatorWidth}px`,
				}}
			>
				{children}
			</div>
		</TabsContext.Provider>
	)
}

interface TabsListProps {
	/**
	 * `<Tabs.Tab />` as children
	 */
	children: ReactNode
	className?: string
}

const TabList = ({ children, className }: TabsListProps) => {
	const { tabsListRef } = useTabsContext()
	return (
		<div className={classNames(s['tablist-wrapper'], className)}>
			<ul className={s.tablist} role="tablist" ref={tabsListRef}>
				{children}
				<li className={s.indicator} role="presentation"></li>
			</ul>
		</div>
	)
}

const Tabs = { Provider, TabList, Panel: TabPanel, Tab }

export type { TabsListProps }
export { Tabs }
