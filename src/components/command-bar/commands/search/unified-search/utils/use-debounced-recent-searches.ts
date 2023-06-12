import { useEffect, useState } from 'react'
import useRecentSearches from '../../hooks/use-recent-searches'
import { useSetStateDebounce } from './use-set-state-debounce'

export function useDebouncedRecentSearches(currentInputValue: string) {
	const [debouncedInput, setDebouncedInput] = useState<string>(undefined)
	const { recentSearches, addRecentSearch } = useRecentSearches()

	/**
	 * Delay recording search queries while the user is typing
	 */
	useSetStateDebounce(setDebouncedInput, currentInputValue, 300)

	/**
	 * Add a new "recent search" when the debounced input value updates.
	 *
	 * TODO: consider longer debounce for setting recent search queries?
	 * Or maybe additional debounce should be built into `useRecentSearches`?
	 * `debouncedInput` is now only used for recent search queries,
	 * so maybe the debounce should be part of some variation of the
	 * `useRecentSearches` hook instead of how things currently are?
	 */
	useEffect(
		() => addRecentSearch(debouncedInput),
		[addRecentSearch, debouncedInput]
	)

	return recentSearches
}
