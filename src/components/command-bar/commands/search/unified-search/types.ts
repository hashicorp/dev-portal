import type { Hit } from 'instantsearch.js'

export type UnifiedSearchableContentType =
	| 'global'
	| 'docs'
	| 'integration'
	| 'tutorial'

export type UnifiedSearchResults = Record<
	UnifiedSearchableContentType,
	{
		searchQuery?: string
		hits: Hit[]
	}
>
