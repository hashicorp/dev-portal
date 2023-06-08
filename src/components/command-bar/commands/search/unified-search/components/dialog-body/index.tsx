/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useEffect, useMemo, useState } from 'react'
import algoliasearch from 'algoliasearch'
import { Configure, InstantSearch } from 'react-instantsearch-hooks-web'
import { useSetStateDebounce } from './use-set-state-debounce'
//
import { useCommandBar } from 'components/command-bar'
//
import useRecentSearches from '../../../hooks/use-recent-searches'
import { generateSuggestedPages } from '../../../helpers'
import { UnifiedSearchDialogContents } from '../dialog-contents'
// Types
import type { SuggestedPage } from '../../../components'
import type { ProductSlug } from 'types/products'
import { useCommandBarProductTag } from './use-command-bar-product-tag'

/**
 * TODO: add description
 *
 * TODO(brkalow): We might consider lazy-loading the search client & the insights library
 */
const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY
const searchClient = algoliasearch(appId, apiKey)

/**
 * TODO: add description
 */
export function UnifiedSearchDialogBody() {
	const { currentInputValue } = useCommandBar()
	const currentProductTag = useCommandBarProductTag()
	const [searchQuery, setSearchQuery] = useState<string>(undefined)
	const { recentSearches, addRecentSearch } = useRecentSearches()

	// Delay sending off search queries while the user is typing
	useSetStateDebounce(setSearchQuery, currentInputValue, 300)

	// Add a new "recent search" when the (debounced) `searchQuery` value updates.
	/**
	 * TODO: consider longer debounce for setting recent search queries?
	 * Or maybe additional debounce should be built into `useRecentSearches`?
	 */
	useEffect(() => addRecentSearch(searchQuery), [addRecentSearch, searchQuery])

	// Generate suggested pages, memoized.
	// TODO: investigate why this was memo-ized?
	const suggestedPages = useMemo<SuggestedPage[]>(() => {
		return generateSuggestedPages(currentProductTag?.id as ProductSlug)
	}, [currentProductTag])

	return (
		<InstantSearch
			indexName={__config.dev_dot.algolia.unifiedIndexName}
			searchClient={searchClient}
		>
			<Configure query={searchQuery} />
			<UnifiedSearchDialogContents
				currentProductTag={currentProductTag}
				recentSearches={recentSearches}
				suggestedPages={suggestedPages}
			/>
		</InstantSearch>
	)
}
