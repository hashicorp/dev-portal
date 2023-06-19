/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useMemo } from 'react'
// Libraries
import algoliasearch from 'algoliasearch'
import {
	Configure,
	InstantSearch,
	Index,
	Hits,
	useHits,
} from 'react-instantsearch-hooks-web'
// Command bar
import { useCommandBar } from 'components/command-bar'
// Shared search
import { generateSuggestedPages } from '../../../helpers'
import { RecentSearches, SuggestedPages } from '../../../components'
// Unified search
import { UnifiedHitsContainer } from '../unified-hits-container'
import {
	getAlgoliaProductFilterString,
	useCommandBarProductTag,
	useDebouncedRecentSearches,
} from './helpers'
import { gatherSearchTabsContent } from '../unified-hits-container/helpers'
// Types
import type { ProductSlug } from 'types/products'
import type { SuggestedPage } from '../../../components'
// Styles
import s from './dialog-body.module.css'

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
 * If we have an input value in the command bar, we render search results
 * from Algolia, through the `UnifiedHitsContainer` component. We apply
 * an initial filter for the current product context where applicable.
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
	const suggestedPages = useMemo<SuggestedPage[]>(() => {
		return generateSuggestedPages(currentProductSlug)
	}, [currentProductSlug])

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
				filters={getAlgoliaProductFilterString(
					currentProductSlug,
					'integration'
				)}
			/>

			{/* <Index
				indexName={__config.dev_dot.algolia.unifiedIndexName}
				indexId="all"
			>
				<Configure />
				<Hits />
			</Index> */}

			<CustomHitsContainer
				currentProductSlug={currentProductSlug}
				suggestedPages={suggestedPages}
			/>
		</InstantSearch>
	)
}

/**
 * Note: has to be a separate component, I think?
 *
 * TODO: maybe useHits provides filtering capabilities?
 * Or is there a hook version of "Configure"? Not sure...
 */
function CustomHitsContainer({
	currentProductSlug,
	suggestedPages,
}: {
	currentProductSlug?: ProductSlug
	suggestedPages: SuggestedPage[]
}) {
	const { hits: rawHits } = useHits()

	/**
	 * Transform searchableContentTypes into data for each content tab.
	 *
	 * Note: we set up this data before rather than during render,
	 * because each tab needs data from all other tabs in order
	 * to show a helpful "No Results" message.
	 */
	const allTabData = useMemo(
		() => gatherSearchTabsContent(rawHits, currentProductSlug),
		[rawHits, currentProductSlug]
	)

	return (
		<UnifiedHitsContainer
			tabData={allTabData}
			suggestedPages={suggestedPages}
		/>
	)
}
