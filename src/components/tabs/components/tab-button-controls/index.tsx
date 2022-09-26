import { KeyboardEvent, useEffect, useRef } from 'react'
import classNames from 'classnames'
import deriveKeyEventState from 'lib/derive-key-event-state'
import { TabControlsProps, TabItem } from '../../types'
import newIndexFromKeypress from '../../helpers/new-index-from-keypress'
import s from './tab-button-controls.module.css'

function TabButtonControls({
	isNested,
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
	 * After keypress events, but not after clicks,
	 * focus the newly active tab button.
	 * The `wasKeypress` ref is necessary so that this effect only runs when
	 * `activeTabIndex` is updated via arrow key presses.
	 */
	useEffect(() => {
		if (wasKeypress.current) {
			const focusTarget = buttonElements.current[activeTabIndex]
			focusTarget?.focus()
			wasKeypress.current = false
		}
	}, [activeTabIndex])

	/**
	 * We want to prevent default behavior for the keys that we listen for in
	 * the `handleKeyUp` handler, as well as for the Space and Enter keys,
	 * which would otherwise trigger unnecessary `onClick` events.
	 */
	const handleKeyDown = (event: KeyboardEvent) => {
		const { isArrowRightKey, isArrowLeftKey, isSpaceKey, isEnterKey } =
			deriveKeyEventState(event)
		if (isArrowLeftKey || isArrowRightKey || isSpaceKey || isEnterKey) {
			event.preventDefault()
		}
	}

	/**
	 * Note: keyUp events don't repeat, but keyDown ones do.
	 * We don't want a long hold of the left or right arrow keys to
	 * rapidly change the active tab. So, we use keyUp here.
	 *
	 * This is based on the implementation at:
	 * https://www.w3.org/TR/wai-aria-practices-1.2/examples/tabs/tabs-1/tabs.html
	 */
	const handleKeyUp = (event: KeyboardEvent) => {
		const newIndex = newIndexFromKeypress(
			event,
			activeTabIndex,
			tabItems.length
		)
		if (newIndex !== activeTabIndex) {
			wasKeypress.current = true
			setActiveTabIndex(newIndex)
		}
	}

	return (
		<div
			aria-label={!ariaLabelledBy ? ariaLabel : undefined}
			aria-labelledby={ariaLabelledBy}
			className={classNames(s.tabList, { [s.isNested]: isNested })}
			role="tablist"
		>
			{tabItems.map((tabItem: TabItem, index: number) => {
				const { icon, isActive, label, tabId, panelId } = tabItem
				return (
					<button
						className={classNames(
							s.tabButton,
							{ [s.isNested]: isNested },
							'g-focus-ring-from-box-shadow',
							'hds-typography-body-200'
						)}
						aria-controls={panelId}
						aria-selected={isActive}
						id={tabId}
						key={tabId}
						onClick={() => setActiveTabIndex(index)}
						onKeyDown={handleKeyDown}
						onKeyUp={handleKeyUp}
						ref={(element: HTMLButtonElement) =>
							(buttonElements.current[index] = element)
						}
						role="tab"
						tabIndex={isActive ? 0 : -1}
						type="button"
					>
						{icon}
						{label}
					</button>
				)
			})}
		</div>
	)
}

export { TabButtonControls }
