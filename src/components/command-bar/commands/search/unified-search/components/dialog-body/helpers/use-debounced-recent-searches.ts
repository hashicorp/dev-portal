/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useEffect, useState } from 'react'
import useRecentSearches from '../../../../hooks/use-recent-searches'
// Types
import type { Dispatch, SetStateAction } from 'react'

/**
 * Debounce a setState function to the providing millisecond timing.
 *
 * Used as a temporary measure to retain debouncing of "recent search" query
 * strings. Later, we may want to consider a different debounce method.
 */
export function useSetStateDebounce<T>(
	setStateFn: Dispatch<SetStateAction<T>>,
	stateValue: T,
	timing: number
) {
	useEffect(() => {
		const typingDebounce = setTimeout(() => {
			setStateFn(stateValue)
		}, timing)
		return () => clearTimeout(typingDebounce)
	}, [stateValue, timing, setStateFn])
}

/**
 * Given the current input value,
 *
 * Save recent search input values to local storage with the `useRecentSearches`
 * hook, while debouncing input value changes to prevent every keystroke
 * from being saves.
 *
 * TODO: consider longer debounce for setting recent search queries?
 * Or maybe additional debounce should be built into `useRecentSearches`?
 *
 * Maybe the debounce should be part of some variation of the
 * `useRecentSearches` hook instead of how things currently are?
 */
export function useDebouncedRecentSearches(currentInputValue: string) {
	const [debouncedInput, setDebouncedInput] = useState<string>(undefined)
	const { recentSearches, addRecentSearch } = useRecentSearches()

	/**
	 * Delay recording search queries while the user is typing
	 */
	useSetStateDebounce(setDebouncedInput, currentInputValue, 300)

	/**
	 * Add a new "recent search" when the debounced input value updates.
	 */
	useEffect(
		() => addRecentSearch(debouncedInput),
		[addRecentSearch, debouncedInput]
	)

	return recentSearches
}
