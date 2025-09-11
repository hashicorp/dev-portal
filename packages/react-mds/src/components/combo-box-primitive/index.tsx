'use client'

import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useId,
	useState,
} from 'react'
import { TextInputBase } from '../form/text-input'

type TComboBoxItem = {
	id: string
	value: string
	label: string
}

const idWithPrefix = (prefix: string, id: string) => {
	return `${prefix}__${id}`
}

/**
 * Something to note as you move through the code
 * The distinction between the native browser focus and the visually focused item
 *
 * The native browser focus only ever alternates between the toggle and the search input, focus should never be on an individual {@link ComboBox.Item}
 * The currently selected item is visually identified with css and marked in the accessibility tree with `aria-selected`
 *
 * You can see more in the [combobox aria guide](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/).
 *
 * To make this terse in our implementation, we use the term `vFocus` to refer to the visually focused {@link ComboBox.Item}
 */
const NOTHING_VFOCUSED = -1

type ComboBoxIds = {
	toggle?: string
	popover?: string
	listbox?: string
}

function assertUniqueIds(ids: ComboBoxIds) {
	const idToKeysMap = new Map<string, string[]>()
	for (const [key, id] of Object.entries(ids)) {
		if (!id) continue
		const existingKeys = idToKeysMap.get(id) || []
		idToKeysMap.set(id, [...existingKeys, key])
	}

	// tells the caller specifically which ids are duplicated
	for (const [id, keys] of idToKeysMap) {
		if (keys.length > 1) {
			throw new Error(
				`ComboBox: id '${id}' is duplicated in ${keys.join(', ')}`
			)
		}
	}
}

/**
 * internally, we generate them if not provided
 * so we can assert truthiness
 */
type InternalComboBoxIds = {
	toggle: string
	popover: string
	listbox: string
}

interface ComboBoxContext {
	addItem: (item: TComboBoxItem) => void
	selectItem: (item: TComboBoxItem) => void
	vFocusByIdx: (idx: number) => void
	vFocus: (item: TComboBoxItem) => void
	vFocusNext: () => void
	vFocusPrev: () => void
	getSelectedItem: () => TComboBoxItem | null
	getVFocusedItem: () => TComboBoxItem | null
	getItems: () => TComboBoxItem[]
	removeItem: (item: TComboBoxItem) => void
	searchInputRef: React.RefObject<HTMLInputElement>
	toggleRef: React.RefObject<HTMLDivElement>
	listRef: React.RefObject<HTMLUListElement>
	isOpen: boolean
	closePopover: () => void
	openPopover: () => void
	handleVFocusKeyboardControls: (e: React.KeyboardEvent) => void
	ids: React.MutableRefObject<InternalComboBoxIds>
}

const ComboBoxContext = createContext<ComboBoxContext | null>(null)

const useComboBox = (): ComboBoxContext => {
	const ctx = useContext(ComboBoxContext)
	if (!ctx) {
		throw new Error('useComboBox must be used within a ComboBoxProvider')
	}
	return ctx
}

interface ComboBoxProviderProps {
	children: React.ReactNode
	/**
	 * This does **not** loop the items, it loops the focus when the items are exhausted.
	 * Meaning that if set to `true` and the user navigates to the last {@link ComboBox.Item} and presses `ArrowDown`,
	 * the focus will not loop back around to the first {@link ComboBox.Item}, it will return focus to the {@link ComboBox.Trigger} and close the popover.
	 * Otherwise, if set to `false` and the user navigates to the last {@link ComboBox.Item} and presses `ArrowDown`,
	 * it will just remain there.
	 *
	 * @default true
	 */
	keyboardFocusLoop?: boolean
	ids?: ComboBoxIds
	onChangeVFocusedOption?: (option: TComboBoxItem) => void
	onChangeSelectedOption?: (option: TComboBoxItem) => void
}

const ComboBoxProvider = ({
	children,
	keyboardFocusLoop = true,
	ids: providedIds = {},
	onChangeVFocusedOption,
	onChangeSelectedOption,
}: ComboBoxProviderProps) => {
	assertUniqueIds(providedIds)

	const itemsRef = useRef<TComboBoxItem[]>([])
	const internalUsedIds = useRef(new Set<TComboBoxItem['id']>())
	const [selectedItem, _setSelectedItem] = useState<TComboBoxItem | null>(null)
	const [vFocusedItemIdx, _setVFocusedItemIdx] = useState(NOTHING_VFOCUSED)
	const toggleRef = useRef<HTMLDivElement>(null)
	const searchInputRef = useRef<HTMLInputElement>(null)
	const [isOpen, setIsOpen] = useState(false)
	const listRef = useRef<HTMLUListElement>(null)

	const fallBackToggleId = idWithPrefix('hashi-combo-box-toggle', useId())
	const fallBackPopoverId = idWithPrefix('hashi-combo-box-popover', useId())
	const fallBackListboxId = idWithPrefix('hashi-combo-box-listbox', useId())

	// proxy the react state to simulate event listeners
	const setSelectedItem = useCallback(
		(item: TComboBoxItem) => {
			_setSelectedItem(item)
			onChangeSelectedOption?.(item)
		},
		[onChangeSelectedOption]
	)

	const setVFocusedItemIdx = useCallback(
		(idx: number) => {
			_setVFocusedItemIdx(idx)
			onChangeVFocusedOption?.(itemsRef.current[idx])
		},
		[onChangeVFocusedOption]
	)

	const ids = useRef<InternalComboBoxIds>({
		toggle: providedIds.toggle ?? fallBackToggleId,
		popover: providedIds.popover ?? fallBackPopoverId,
		listbox: providedIds.listbox ?? fallBackListboxId,
	})

	const vFocusByIdx = useCallback(
		(idx: number) => {
			setVFocusedItemIdx(idx)
		},
		[setVFocusedItemIdx]
	)

	const vFocusNext = useCallback(() => {
		const items = itemsRef.current
		if (vFocusedItemIdx === NOTHING_VFOCUSED) return 0
		const potentialNextIndex = vFocusedItemIdx + 1
		const isAtEnd = potentialNextIndex >= items.length
		let idx
		if (isAtEnd && keyboardFocusLoop) {
			idx = NOTHING_VFOCUSED
			setIsOpen(false)
		} else {
			idx = isAtEnd ? vFocusedItemIdx : potentialNextIndex
		}

		vFocusByIdx(idx)
	}, [keyboardFocusLoop, vFocusedItemIdx, vFocusByIdx])

	const vFocusPrev = useCallback(() => {
		if (vFocusedItemIdx === NOTHING_VFOCUSED) return 0
		const potentialPreviousIndex = vFocusedItemIdx - 1
		const isAtStart = potentialPreviousIndex < 0
		let idx
		if (isAtStart && keyboardFocusLoop) {
			idx = NOTHING_VFOCUSED
			setIsOpen(false)
		} else {
			idx = isAtStart ? vFocusedItemIdx : potentialPreviousIndex
		}

		vFocusByIdx(idx)
	}, [keyboardFocusLoop, vFocusedItemIdx, vFocusByIdx])

	const vFocus = useCallback(
		(item: TComboBoxItem) => {
			const foundItemIndex = itemsRef.current.findIndex((i) => i.id === item.id)
			if (foundItemIndex === -1) {
				console.error('ComboBox: Item not found', item)
				return
			}
			setVFocusedItemIdx(foundItemIndex)
		},
		[setVFocusedItemIdx]
	)

	const getVFocusedItem = useCallback(() => {
		if (vFocusedItemIdx === NOTHING_VFOCUSED) return null
		return itemsRef.current[vFocusedItemIdx] || null
	}, [vFocusedItemIdx])

	const selectItem = useCallback(
		(item: TComboBoxItem) => {
			const foundItemIndex = itemsRef.current.findIndex((i) => i.id === item.id)
			if (foundItemIndex === -1) {
				console.error(
					'ComboBox: Item not found, Selected item not updated',
					item
				)
				return
			}
			setSelectedItem(item)
			setIsOpen(false)
		},
		[setSelectedItem]
	)

	const getSelectedItem = useCallback(() => {
		return selectedItem
	}, [selectedItem])

	const addItem = useCallback((item: TComboBoxItem) => {
		if (internalUsedIds.current.has(item.id)) {
			const existing = itemsRef.current.find((i) => i.id === item.id)
			const attemptedToAdd = item
			const dupes = JSON.stringify({
				existing,
				attemptedToAdd,
			})
			const errMessage = `Each ComboBox.Item must have a unique id.\n Found items with duplicate ids: ${dupes}`
			throw Error(errMessage)
		}
		internalUsedIds.current.add(item.id)
		itemsRef.current.push(item)
	}, [])

	const getItems = useCallback(() => {
		return itemsRef.current
	}, [])

	const removeItem = useCallback((item: TComboBoxItem) => {
		internalUsedIds.current.delete(item.id)
		itemsRef.current = itemsRef.current.filter((i) => i.id !== item.id)
	}, [])

	useEffect(() => {
		if (isOpen) {
			searchInputRef.current?.focus()
		}
	}, [isOpen, searchInputRef, toggleRef])

	// if someone navigates to an item, via the keyboard, scroll it into view
	useEffect(() => {
		const vFocusedItem = getVFocusedItem()
		const list = listRef.current
		if (vFocusedItem && list) {
			const itemElement = list.querySelector(
				`[data-combo-box-item-id="${vFocusedItem.id}"]`
			)
			itemElement?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
		}
	}, [getVFocusedItem])

	const closePopover = useCallback(() => {
		setIsOpen(false)
		setVFocusedItemIdx(NOTHING_VFOCUSED)
	}, [setVFocusedItemIdx])

	const openPopover = useCallback(() => {
		setIsOpen(true)
	}, [])

	// we need this event handler in several places because
	// it has to be attached to a focused element
	// if there is a search input in use, that will be the focused element
	// otherwise, it will be the toggle element
	const handleVFocusKeyboardControls = (e: React.KeyboardEvent) => {
		const isScrollingKey = e.key === 'ArrowDown' || e.key === 'ArrowUp'
		const isSpaceKey = e.key === ' '
		const hasSearchInput = searchInputRef.current !== null
		const isSpacePressWithoutSearchInput = isSpaceKey && !hasSearchInput
		if (isScrollingKey || isSpacePressWithoutSearchInput) {
			e.preventDefault()
		}

		switch (e.key) {
			case 'Escape': {
				closePopover()
				break
			}
			case 'ArrowDown': {
				const nothingVFocused = getVFocusedItem() === null
				// if someone presses down on the search input whilst nothing is vFocused, vFocus the first item
				if (isOpen && nothingVFocused) {
					vFocusByIdx(0)
				} else {
					vFocusNext()
				}
				break
			}
			case 'ArrowUp': {
				vFocusPrev()
				break
			}
			case 'Enter': {
				const currItem = getVFocusedItem()
				if (currItem) {
					selectItem(currItem)
				}
				closePopover()
				break
			}
			default:
				break
		}
	}

	return (
		<ComboBoxContext.Provider
			value={{
				addItem,
				selectItem,
				vFocus,
				vFocusByIdx,
				vFocusNext,
				vFocusPrev,
				getSelectedItem,
				getVFocusedItem,
				getItems,
				removeItem,
				searchInputRef,
				toggleRef,
				listRef,
				isOpen,
				closePopover,
				openPopover,
				ids,
				handleVFocusKeyboardControls,
			}}
		>
			{children}
		</ComboBoxContext.Provider>
	)
}

interface ComboBoxItemProps
	extends Omit<
		React.HTMLAttributes<HTMLLIElement>,
		'role' | 'aria-selected' | 'onClick' | 'onKeyDown' | 'onMouseEnter'
	> {
	value: string
	label: string
}

const ComboBoxItem = ({
	id: providedId,
	value,
	label,
	children,
	...restProps
}: React.PropsWithChildren<ComboBoxItemProps>) => {
	const generatedId = idWithPrefix('hashi-combo-box-item', useId())
	const id = providedId ?? generatedId
	const { addItem, removeItem, getVFocusedItem, vFocus, selectItem } =
		useComboBox()

	useEffect(() => {
		addItem({ id, value, label })
		return () => removeItem({ id, value, label })
	}, [addItem, id, removeItem, value, label])

	const isVFocused = getVFocusedItem()?.id === id

	return (
		<li
			data-combo-box-item-id={id}
			role="option"
			aria-selected={isVFocused}
			data-vfocused={isVFocused}
			onClick={() => selectItem({ id, value, label })}
			onMouseEnter={() => vFocus({ id, value, label })}
			{...restProps}
		>
			{children}
		</li>
	)
}

interface ComboBoxTriggerProps {
	children: React.ReactNode
	className?: string
}

const ComboBoxTrigger = ({ children, className }: ComboBoxTriggerProps) => {
	const {
		toggleRef,
		openPopover,
		closePopover,
		isOpen,
		ids,
		handleVFocusKeyboardControls,
		searchInputRef,
	} = useComboBox()

	const handleClick = (e: React.MouseEvent) => {
		e.stopPropagation() // an external click may be registered as an outside click which will close the popover
		if (isOpen) {
			closePopover()
		} else {
			openPopover()
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		const isOpenKey =
			e.key === 'Enter' || e.key === 'ArrowDown' || e.key === ' '
		const isClosed = isOpen === false

		if (isOpenKey && isClosed) {
			e.preventDefault()
			openPopover()
			return
		}

		const hasSearchInput = searchInputRef.current !== null
		// if there is a search input, the event handler will be bound there
		if (!hasSearchInput && isOpen) {
			handleVFocusKeyboardControls(e)
		}
	}

	const getOnBlur = () => {
		return (e: React.FocusEvent) => {
			const isClickInside = e.relatedTarget?.closest('[data-combo-box-popover]')
			if (isClickInside) return
			const hasSearchInput = searchInputRef.current !== null
			if (!hasSearchInput) {
				closePopover()
			}
		}
	}

	return (
		<div
			role="combobox"
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			tabIndex={0}
			ref={toggleRef}
			aria-haspopup="listbox"
			aria-expanded={isOpen}
			aria-controls={ids.current.popover}
			className={className}
			onBlur={getOnBlur()}
		>
			{children}
		</div>
	)
}

interface ComboBoxValueProps {
	placeholder?: string
}

const ComboBoxValue = ({
	placeholder = 'Select an option',
}: ComboBoxValueProps) => {
	const { getSelectedItem } = useComboBox()
	return getSelectedItem()?.label ?? placeholder
}

interface ComboBoxPopoverProps {
	children: React.ReactNode
	className?: string
}

const ComboBoxPopover = ({ children, className }: ComboBoxPopoverProps) => {
	const { isOpen, ids, closePopover } = useComboBox()

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (!isOpen) return
			const target = e.target as HTMLElement
			const isClickInside = target.closest('[data-combo-box-popover]')
			if (isClickInside) return
			closePopover()
		}

		document.addEventListener('click', handleClickOutside)
		return () => {
			document.removeEventListener('click', handleClickOutside)
		}
	}, [isOpen, closePopover])

	if (!isOpen) return null

	return (
		<div id={ids.current.popover} data-combo-box-popover className={className}>
			{children}
		</div>
	)
}

interface ComboBoxListProps extends React.PropsWithChildren {
	/**
	 * Not rendered, used to hint assistive technologies,
	 * indicate the type of options available in the popover
	 * eg. Schools | Languages | Countries
	 */
	label: string
	className?: string
	maxHeight?: `${number}em` | `${number}px` | `${number}%`
	onScroll?: (e: React.UIEvent<HTMLUListElement>) => void
}

const ComboBoxList = ({
	label,
	children,
	className = '',
	maxHeight,
	onScroll,
}: ComboBoxListProps) => {
	const { ids, listRef } = useComboBox()

	return (
		<ul
			id={ids.current.listbox}
			aria-label={label}
			role="listbox"
			tabIndex={-1}
			ref={listRef}
			className={className}
			style={{ maxHeight }}
			onScroll={onScroll}
		>
			{children}
		</ul>
	)
}

interface ComboBoxSearchInputProps {
	placeholder?: string
	value?: string
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
	onBlur?: () => void
}

const ComboBoxSearchInput = ({
	placeholder = 'Search',
	value,
	onChange,
	onBlur,
}: ComboBoxSearchInputProps) => {
	const {
		searchInputRef,
		getVFocusedItem,
		handleVFocusKeyboardControls,
		closePopover,
	} = useComboBox()

	return (
		<TextInputBase
			field={{
				type: 'search',
				ref: searchInputRef,
				autoComplete: 'off',
				'aria-haspopup': 'listbox',
				'aria-autocomplete': 'list',
				role: 'combobox',
				'aria-activedescendant': getVFocusedItem()?.id ?? '',
				placeholder,
				value,
				onChange,
				onKeyDown: handleVFocusKeyboardControls,
				onBlur: (e) => {
					e.stopPropagation()
					const isClickInside = e.relatedTarget?.closest(
						'[data-combo-box-popover]'
					)
					if (isClickInside) return
					closePopover()
					onBlur?.()
				},
			}}
		/>
	)
}

export type { TComboBoxItem, ComboBoxListProps, ComboBoxSearchInputProps }

export const ComboBox = Object.freeze({
	Root: ComboBoxProvider,
	Trigger: ComboBoxTrigger,
	Popover: ComboBoxPopover,
	SearchInput: ComboBoxSearchInput,
	List: ComboBoxList,
	Item: ComboBoxItem,
	Value: ComboBoxValue,
})
