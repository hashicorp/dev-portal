import { useState } from 'react'
import {
	useConfigure,
	useSearchBox,
	UseSearchBoxProps,
} from 'react-instantsearch-hooks-web'
import { IconX16 } from '@hashicorp/flight-icons/svg-react/x-16'

import FilterInput from 'components/filter-input'
import Dialog from 'components/dialog'
import { CurrentFilters } from './components/current-filters'
import { TutorialLibraryResults } from './components/results'
import { SEARCH_TIMEOUT_MS } from './constants'
import { MobileFiltersButton } from './components/mobile-filters-button'

import s from './tutorial-library.module.css'
import { TutorialLibraryFilters } from './components/filters'
import Button from 'components/button'
import { ClearFiltersButton } from './components/clear-filters-button'
import { useFiltersState } from './components/filters/use-filters-state'
import { TutorialLibraryViewProps } from './types'
import Heading from 'components/heading'

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
 * View for the tutorial library page. Assumes it is wrapped in an `InstantSearch` component, which provides the necessary search data
 */
export default function TutorialLibraryView({
	defaultTutorials,
}: TutorialLibraryViewProps) {
	const { query: searchQuery, refine } = useSearchBox({ queryHook })
	const [query, setQuery] = useState<string>(searchQuery)
	const [showMobileFilters, setShowMobileFilters] = useState(false)
	const filtersState = useFiltersState()

	// configure our search client with custom settings
	useConfigure({ hitsPerPage: 24 })

	const handleDialogDismiss = () => setShowMobileFilters(false)

	return (
		<div>
			<Heading level={1} size={500} weight="bold" className={s.pageTitle}>
				Tutorial Library
			</Heading>
			<div className={s.inputFilterSection}>
				<FilterInput
					className={s.input}
					placeholder="Filter results"
					value={query}
					onChange={(value) => {
						setQuery(value)
						refine(value)
					}}
				/>
				<MobileFiltersButton onClick={() => setShowMobileFilters(true)} />
				<Dialog
					isOpen={showMobileFilters}
					label="Tutorial filters"
					onDismiss={handleDialogDismiss}
					variant="bottom"
				>
					<button
						className={s.exitIcon}
						onClick={handleDialogDismiss}
						aria-label="Cancel"
						type="button"
					>
						<IconX16 />
					</button>
					<div className={s.mobileFiltersControls}>
						<Button text="Done" onClick={handleDialogDismiss} />
						<ClearFiltersButton disableWhenNoFilters />
					</div>
					<TutorialLibraryFilters {...filtersState} />
				</Dialog>
			</div>
			<CurrentFilters />
			<TutorialLibraryResults defaultTutorials={defaultTutorials} />
		</div>
	)
}
