/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode, createContext, useContext, useState } from 'react'

const UnifiedHitsContext = createContext([])

export type UnifiedSearchableContentType = 'docs' | 'tutorial' | 'integration'

type HitCounts = Record<UnifiedSearchableContentType | 'all', $TSFixMe>

/**
 * Intended to provides search hit counts across content types.
 */
function UnifiedSearchHitsProvider({ children }: { children: ReactNode }) {
	const [hitsData, setHitsData] = useState<HitCounts>({} as HitCounts)

	return (
		<UnifiedHitsContext.Provider value={[hitsData, setHitsData]}>
			{children}
		</UnifiedHitsContext.Provider>
	)
}

/**
 * Use hitsData and setHitsData, intended to allow hit counts
 * to be shared across search result content types.
 */
function useUnifiedHitsContext() {
	return useContext(UnifiedHitsContext)
}

export { useUnifiedHitsContext }
export default UnifiedSearchHitsProvider
