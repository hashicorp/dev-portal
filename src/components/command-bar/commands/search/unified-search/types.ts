/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

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
