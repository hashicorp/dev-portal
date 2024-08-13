/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useEffect, useMemo, useState } from 'react'
// Libraries
import algoliasearch from 'algoliasearch'
import { Configure, InstantSearch, Index, useHits } from 'react-instantsearch'
// Command bar
import { useCommandBar } from 'components/command-bar'
// Shared search
import { generateSuggestedPages } from '../../../helpers'
// Unified search
import { RecentSearches } from '../recent-searches'
import SuggestedPages from '../suggested-pages'
import { UnifiedHitsContainer } from '../unified-hits-container'
import { gatherSearchTabsData } from '../unified-hits-container/helpers'
import {
	getAlgoliaFilters,
	useCommandBarProductTag,
	useDebouncedRecentSearches,
} from './helpers'
// Types
import type { Hit } from 'instantsearch.js'
import type { ProductSlug } from 'types/products'
import type { SuggestedPageProps } from '../suggested-pages/types'
import type {
	UnifiedSearchResults,
	UnifiedSearchableContentType,
} from '../../types'
// Styles
import s from './dialog-body.module.css'

const ALGOLIA_INDEX_NAME = __config.dev_dot.algolia.unifiedIndexName

/**
 * Initialize the algolia search client.
 *
 * TODO(brkalow): We might consider lazy-loading the search client & the insights library
 */
const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY
const searchClient = algoliasearch(appId, apiKey)

/**
 * Render the command bar dialog body for unified search results.
 *
 * If we have an input in the command bar, we render search results.
 * We apply an initial filter for the current product context where applicable.
 *
 * If we don't have an input value, we render suggested pages, which are
 * tailored to the current product context where applicable.
 *
 * This component also tracks recent searches through `useRecentSearches`.
 */
export function UnifiedSearchCommandBarDialogBody() {
	const { currentInputValue } = useCommandBar()
	const currentProductTag = useCommandBarProductTag()
	const currentProductSlug = currentProductTag?.id as ProductSlug
	const recentSearches = useDebouncedRecentSearches(currentInputValue)

	/**
	 * Generate suggested pages for the current product (if any).
	 */
	const suggestedPages = useMemo<SuggestedPageProps[]>(() => {
		return generateSuggestedPages(currentProductSlug)
	}, [currentProductSlug])

	/**
	 * If there's no searchQuery yet, show suggested pages.
	 */
	if (!currentInputValue) {
		return (
			<>
				<div className={s.suggestedPagesWrapper}>
					<RecentSearches recentSearches={recentSearches} />
					<SuggestedPages pages={suggestedPages} />
				</div>
			</>
		)
	}

	/**
	 * Render search results
	 */
	return (
		<>
			<SearchResults
				currentInputValue={currentInputValue}
				currentProductSlug={currentProductSlug}
				suggestedPages={suggestedPages}
			/>
		</>
	)
}

/**
 * Render unified search results for the provided query input.
 */
function SearchResults({
	currentProductSlug,
	currentInputValue,
	suggestedPages,
}: {
	currentProductSlug: ProductSlug
	currentInputValue: string
	suggestedPages: SuggestedPageProps[]
}) {
	/**
	 * State collects results from multiple separate content-type queries.
	 */
	const [unifiedSearchResults, setUnifiedSearchResults] =
		useState<UnifiedSearchResults>({
			global: { hits: [] },
			docs: { hits: [] },
			integration: { hits: [] },
			tutorial: { hits: [] },
		})
	/**
	 * `setHitData` allows easy updating of hits for a specific content type
	 */
	function setHitData(type: UnifiedSearchableContentType, hits: Hit[]) {
		setUnifiedSearchResults((previous) => ({ ...previous, [type]: { hits } }))
	}

	/**
	 * Transform unified search results into data for each content-type tab.
	 *
	 * Note: we set up this data before rather than during render,
	 * because each tab needs data from all other tabs in order
	 * to show a helpful "No Results" message.
	 */
	const tabsData = useMemo(() => {
		return gatherSearchTabsData(unifiedSearchResults, currentProductSlug)
	}, [unifiedSearchResults, currentProductSlug])

	return (
		<>
			{/* <InstantSearch /> updates algoliaData, and renders nothing.
			    Maybe helpful to think of this as "the part that fetches results". */}
			<InstantSearch indexName={ALGOLIA_INDEX_NAME} searchClient={searchClient}>
				{['global', 'docs', 'integration', 'tutorial'].map(
					(type: UnifiedSearchableContentType) => {
						const filters = getAlgoliaFilters(currentProductSlug, type)
						return (
							<Index key={type} indexName={ALGOLIA_INDEX_NAME} indexId={type}>
								<Configure query={currentInputValue} filters={filters} />
								<HitsReporter setHits={(hits) => setHitData(type, hits)} />
							</Index>
						)
					}
				)}
			</InstantSearch>
			{/* UnifiedHitsContainer renders search results in a tabbed interface. */}
			<UnifiedHitsContainer
				tabsData={tabsData}
				suggestedPages={suggestedPages}
			/>
		</>
	)
}

/**
 * When hits within this index context are updated,
 * Update the <HitCountsProvider /> data for this content type.
 *
 * This component doesn't render anything, it only gathers hit data.
 */
function HitsReporter({ setHits }: { setHits: (hits: Hit[]) => void }) {
	const { hits } = useHits()
	useEffect(() => setHits(hits), [hits])
	return null
}
