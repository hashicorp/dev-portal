import type { Hit } from 'instantsearch.js'

// TODO: set up an enum for this
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
