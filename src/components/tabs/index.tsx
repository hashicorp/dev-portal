/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { KeyboardEvent, ReactElement, useState, useRef, useEffect } from 'react'
import classNames from 'classnames'
import { TabItem, TabsProps } from './types'
import { useHasOverflow, useSyncedTabGroups, useTabItems } from './hooks'
import { Tab, TabButtonControls, TabDropdownControls } from './components'
import TabNestingProvider, { useIsNested } from './helpers/tab-nesting-context'
import s from './tabs.module.css'
import deriveKeyEventState from 'lib/derive-key-event-state'

const Tabs = ({
	allowNestedStyles = false,
	ariaLabel,
	ariaLabelledBy,
	children,
	initialActiveIndex = 0,
	showAnchorLine = true,
	variant = 'normal',
	onChange,
}: TabsProps): ReactElement => {
	/**
	 * TODO: this is a temporary measure until we are able to start requiring
	 * either (but not both) of these properties via TypeScript. See the block
	 * comment in `./types.ts` for context.
	 */
	if (ariaLabel && ariaLabelledBy) {
		throw new Error(
			'Both ariaLabel and ariaLabelledBy provided to Tabs component. Please only provide one.'
		)
	}

	/**
	 * Track tab nesting level, for styling purposes
	 */
	const isNested = useIsNested()

	/**
	 * Track whether tabs are overflowing, so we can switch to a select.
	 */
	const [hasOverflow, overflowTargetRef] = useHasOverflow<HTMLDivElement>()

	/**
	 * Track the active tab
	 */
	const [activeTabIndex, setActiveTabIndex] =
		useState<number>(initialActiveIndex)

	/**
	 * TODO: this is for <button /> elements rendered within content
	 * that change the current tab. Need to find better home for it.
	 *
	 * After keydown events on elements within tabbed content that change tabs,
	 * We want to focus the tab controls (may be buttons, or select).
	 */
	const wasKeypress = useRef<boolean>(false)

	/**
	 * TODO: this is for <button /> elements rendered within content
	 * that change the current tab. Need to find better home for it.
	 *
	 * After keypress events, but not after clicks,
	 * focus the newly active tab button.
	 * The `wasKeypress` ref is necessary so that this effect only runs when
	 * `activeTabIndex` is updated via arrow key presses.
	 */
	useEffect(() => {
		if (wasKeypress.current) {
			const tabControlsContainer = overflowTargetRef.current
			/**
			 * Activation of button elements within content could happen regardless
			 * of which control style is being used, so we account for both:
			 * - `select` for `tab-dropdown-controls`
			 * - `button` for `tab-button-controls`
			 */
			let focusTarget
			const selectControl = tabControlsContainer.querySelector('select')
			if (selectControl) {
				focusTarget = selectControl
			} else {
				const buttonElements = Array.from(
					tabControlsContainer.querySelectorAll('button')
				)
				focusTarget = buttonElements[activeTabIndex]
			}
			focusTarget?.focus()
			wasKeypress.current = false
		}
	}, [activeTabIndex])

	/**
	 * TODO: this is for <button /> elements rendered within content
	 * that change the current tab. Need to find better home for it.
	 */
	const handleKeyUp = (
		event: KeyboardEvent<HTMLButtonElement>,
		newIndex: number
	) => {
		const { isSpaceKey, isEnterKey } = deriveKeyEventState(event)
		const isActivated = isSpaceKey || isEnterKey
		if (isActivated && newIndex !== activeTabIndex) {
			wasKeypress.current = true
			setActiveTabIndex(newIndex)
		}
	}

	/**
	 * useTabItems efficiently handles validation & activation of tabItems
	 */
	const tabItems = useTabItems({ children, activeTabIndex, initialActiveIndex })

	/**
	 * Handle syncing active tab index and active tab group.
	 *
	 * Note: only works where tabs have groups, eg <Tab group="some-string" />.
	 */
	const setSyncedActiveTabIndex = useSyncedTabGroups({
		activeTabIndex,
		setActiveTabIndex,
		tabItems,
	})

	/**
	 * TODO: add description
	 */
	function setSyncedIndexWithOnChange(index) {
		setSyncedActiveTabIndex(index)
		onChange?.(index)
	}

	/**
	 * If there's overflow, show a dropdown. Otherwise show typical tabs.
	 * TODO: current TabDropdownControls is temporary, and will be redone later.
	 * Task to replace TabDropdownControls:
	 * https://app.asana.com/0/1202097197789424/1202133172981709/f
	 */
	const TabControls = hasOverflow ? TabDropdownControls : TabButtonControls

	return (
		<TabNestingProvider>
			<div>
				<div
					className={classNames(s.tabControls, s[`variant--${variant}`], {
						[s.isCheckingOverflow]: hasOverflow === null,
						[s.showAnchorLine]: showAnchorLine,
						[s.allowNestedStyles]: allowNestedStyles,
					})}
					ref={overflowTargetRef}
				>
					<TabControls
						activeTabIndex={activeTabIndex}
						ariaLabel={ariaLabel}
						ariaLabelledBy={ariaLabelledBy}
						isNested={allowNestedStyles && isNested}
						setActiveTabIndex={setSyncedIndexWithOnChange}
						tabItems={tabItems}
						variant={variant}
					/>
				</div>
				{tabItems.map((tabItem: TabItem) => {
					const { content, tabId, panelId, isActive, renderContent } = tabItem
					return (
						<div
							aria-hidden={!isActive}
							aria-labelledby={tabId}
							className={classNames(s.tabPanel, {
								[s.isNested]: isNested,
								[s.allowNestedStyles]: allowNestedStyles,
							})}
							id={panelId}
							key={panelId}
							role="tabpanel"
						>
							{renderContent
								? renderContent({
										activeTabIndex,
										setActiveTabIndex: setSyncedIndexWithOnChange,
										handleKeyUp,
								  })
								: content}
						</div>
					)
				})}
			</div>
		</TabNestingProvider>
	)
}

export default Tabs
export { Tab }
