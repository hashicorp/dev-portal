import { useState } from 'react'
import { useSearchBox, UseSearchBoxProps } from 'react-instantsearch-hooks-web'

import FilterInput from 'components/filter-input'
import { CurrentFilters } from './components/current-filters'
import { TutorialLibraryResults } from './components/results'
import { SEARCH_TIMEOUT_MS } from './constants'

let timerId = undefined
/**
 * Called when a search is triggered from the search input. This allows us to
 * throttle the number of network calls based on the SEARCH_TIMEOUT_MS constant.
 */
const queryHook: UseSearchBoxProps['queryHook'] = (query, search) => {
	if (timerId) {
		clearTimeout(timerId)
	}

	timerId = setTimeout(() => search(query), SEARCH_TIMEOUT_MS)
}

/**
 *
 * @TODO pagination
 */
export default function TutorialLibraryView() {
	const { query: searchQuery, refine } = useSearchBox({ queryHook })
	const [query, setQuery] = useState<string>(searchQuery)

	return (
		<div>
			<h1>Tutorial Library</h1>
			<FilterInput
				placeholder="Filter results"
				value={query}
				onChange={(value) => {
					setQuery(value)
					refine(value)
				}}
			/>
			<CurrentFilters />
			<TutorialLibraryResults />
		</div>
	)
}
