import { SearchableContentType } from 'contexts'
import { ReactNode, createContext, useContext, useState } from 'react'

const SearchHitsContext = createContext([])

type HitCounts = Record<SearchableContentType, number>

/**
 * Intended to provides search hit counts across content types.
 */
function SearchHitsProvider({ children }: { children: ReactNode }) {
	const [hitCounts, setHitCounts] = useState<HitCounts>({} as HitCounts)

	return (
		<SearchHitsContext.Provider value={[hitCounts, setHitCounts]}>
			{children}
		</SearchHitsContext.Provider>
	)
}

/**
 * Use hitCounts and setHitCounts, intended to allow hit counts
 * to be shared across search result content types.
 */
function useHitsContext() {
	return useContext(SearchHitsContext)
}

export { useHitsContext }
export default SearchHitsProvider
