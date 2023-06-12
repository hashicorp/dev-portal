/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useEffect, useMemo, useState } from 'react'
import algoliasearch from 'algoliasearch'
import { Configure, InstantSearch } from 'react-instantsearch-hooks-web'
import { useSetStateDebounce } from '../../utils/use-set-state-debounce'
//
import { useCommandBar } from 'components/command-bar'
//
import useRecentSearches from '../../../hooks/use-recent-searches'
import { generateSuggestedPages } from '../../../helpers'
import { UnifiedHitsContainer } from '../unified-hits-container'
// Types
import {
	RecentSearches,
	SuggestedPages,
	type SuggestedPage,
} from '../../../components'
import type { ProductSlug } from 'types/products'
import { useCommandBarProductTag } from '../../utils/use-command-bar-product-tag'
import { buildAlgoliaFilters } from '../../utils/build-algolia-filters'
import s from './dialog-body.module.css'

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
export function UnifiedSearchCommandBarDialogBody() {
	const { currentInputValue } = useCommandBar()
	const currentProductTag = useCommandBarProductTag()
	// TODO: debouncing should be handled by recent searches hook, I think
	const [debouncedInput, setDebouncedInput] = useState<string>(undefined)
	const { recentSearches, addRecentSearch } = useRecentSearches()

	/**
	 * Delay recording search queries while the user is typing
	 */
	useSetStateDebounce(setDebouncedInput, currentInputValue, 300)

	/**
	 * Add a new "recent search" when the debounced input value updates.
	 *
	 * TODO: consider longer debounce for setting recent search queries?
	 * Or maybe additional debounce should be built into `useRecentSearches`?
	 * `debouncedInput` is now only used for recent search queries,
	 * so maybe the debounce should be part of some variation of the
	 * `useRecentSearches` hook instead of how things currently are?
	 */
	useEffect(
		() => addRecentSearch(debouncedInput),
		[addRecentSearch, debouncedInput]
	)

	/**
	 * Generate suggested pages for the current product (if any).
	 */
	const suggestedPages = useMemo<SuggestedPage[]>(() => {
		return generateSuggestedPages(currentProductTag?.id as ProductSlug)
	}, [currentProductTag])

	/**
	 * If there's no searchQuery yet, show suggested pages.
	 */
	if (!currentInputValue) {
		return (
			<div className={s.suggestedPagesWrapper}>
				<RecentSearches recentSearches={recentSearches} />
				<SuggestedPages pages={suggestedPages} />
			</div>
		)
	}

	/**
	 * Render search results based on the current input value.
	 */
	return (
		<InstantSearch
			indexName={__config.dev_dot.algolia.unifiedIndexName}
			searchClient={searchClient}
		>
			<Configure
				query={currentInputValue}
				filters={buildAlgoliaFilters(currentProductTag)}
			/>
			<UnifiedHitsContainer
				currentProductTag={currentProductTag}
				suggestedPages={suggestedPages}
			/>
		</InstantSearch>
	)
}
