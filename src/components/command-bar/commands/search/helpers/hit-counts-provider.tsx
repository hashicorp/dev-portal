/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode, createContext, useContext, useState } from 'react'
import type { SearchContentTypes } from '../unified-search/types'

const SearchHitsContext = createContext([])

type HitCounts = Record<
	Exclude<SearchContentTypes, SearchContentTypes.GLOBAL>,
	number
>

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
