import { useCallback, useEffect, useRef } from 'react'
import { useId } from '@react-aria/utils'
import deriveKeyEventState from 'lib/derive-key-event-state'
import Text from 'components/text'
import { CommandBarListProps } from './types'
import s from './command-bar-list.module.css'

const CommandBarList = ({
	ariaLabelledBy,
	children,
	label,
}: CommandBarListProps) => {
	const listRef = useRef<HTMLUListElement>()
	const componentId = useId()
	const labelId = `${componentId}-label`

	const hasAccessibleLabel = !!ariaLabelledBy || !!label
	if (!hasAccessibleLabel) {
		throw new Error(
			'CommandBarList requires one of: `ariaLabelledBy` or `label`.'
		)
	}

	const hasTooManyLabels = !!ariaLabelledBy && !!label
	if (hasTooManyLabels) {
		throw new Error(
			'CommandBarList was given both `ariaLabelledBy and `label`. Only provide one.'
		)
	}

	const handleKeyDown = useCallback((e) => {
		const focusableChildren = Array.from(
			listRef?.current?.querySelectorAll('a,button')
		) as (HTMLAnchorElement | HTMLButtonElement)[]

		let indexOfCurrentFocus: number
		focusableChildren.find(
			(child: HTMLAnchorElement | HTMLButtonElement, index: number) => {
				indexOfCurrentFocus = index
				return child.getAttribute('tabindex') === '0'
			}
		)

		const isFirstChild = indexOfCurrentFocus === 0
		const isLastChild = indexOfCurrentFocus === focusableChildren.length - 1
		const { isArrowDownKey, isArrowUpKey } = deriveKeyEventState(e)

		let indexToFocus: number
		if (isArrowDownKey) {
			if (isLastChild) {
				indexToFocus = 0
			} else {
				indexToFocus = indexOfCurrentFocus + 1
			}
		} else if (isArrowUpKey) {
			if (isFirstChild) {
				indexToFocus = focusableChildren.length - 1
			} else {
				indexToFocus = indexOfCurrentFocus - 1
			}
		}

		if (indexToFocus >= 0) {
			// prevent scrolling
			e.preventDefault()

			// reset the tabindex of the previously focused item
			focusableChildren[indexOfCurrentFocus].setAttribute('tabindex', '-1')

			// update the tabindex of the item about to be focused
			focusableChildren[indexToFocus].setAttribute('tabindex', '0')

			// focus the new item
			focusableChildren[indexToFocus].focus()
		}
	}, [])

	/**
	 * On initial load, and every time the `children` change, set the tabindex of
	 * the first anchor or button child to 0. This includes the child in the page
	 * TAB sequence.
	 */
	useEffect(() => {
		listRef.current
			.querySelectorAll('a,button')[0]
			.setAttribute('tabindex', '0')
	}, [children])

	return (
		<div className={s.root}>
			<Text asElement="p" className={s.label} size={100} weight="semibold">
				{label}
			</Text>
			<ul
				aria-labelledby={labelId}
				className={s.list}
				onKeyDown={handleKeyDown}
				ref={listRef}
			>
				{children}
			</ul>
		</div>
	)
}

export type { CommandBarListProps }
export { CommandBarList }
