import { useCallback, useState } from 'react'

const RECENT_SEARCHES_KEY = 'DEV_DOT_RECENT_SEARCHES'

/**
 * Get the current list of recent searches stored in local storage. If one does
 * not exist, an empty one is created.
 */
const initializeRecentSearches = () => {
	try {
		const storageValue = window.localStorage.getItem(RECENT_SEARCHES_KEY)

		if (!storageValue) {
			window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify([]))
			return []
		} else {
			return JSON.parse(storageValue)
		}
	} catch (e) {
		// window may be 'undefined'
		// localStorage may be disabled
	}
}

const useRecentSearches = () => {
	const [recentSearches, setRecentSearches] = useState<string[]>(
		initializeRecentSearches
	)

	/**
	 * Set up a callback for adding to the recent searches list.
	 */
	const addRecentSearch = useCallback(
		(searchQuery: string) => {
			// We can ignore falsy values
			if (!searchQuery) {
				return
			}

			try {
				// Filter out the new value if it's already in the list
				let newList = [...recentSearches].filter(
					(recentSearch: string) => recentSearch !== searchQuery
				)

				// Add the new value to the front of the list
				newList = [searchQuery, ...newList]

				// Only keep the 3 most recent values
				newList = newList.slice(0, 3)

				// Update local storage and state if the new list is different
				if (JSON.stringify(newList) !== JSON.stringify(recentSearches)) {
					window.localStorage.setItem(
						RECENT_SEARCHES_KEY,
						JSON.stringify(newList)
					)
					setRecentSearches(newList)
				}
			} catch (e) {
				// window may be 'undefined'
				// localStorage may be disabled
			}
		},
		[recentSearches]
	)

	return { recentSearches, addRecentSearch }
}

export default useRecentSearches
