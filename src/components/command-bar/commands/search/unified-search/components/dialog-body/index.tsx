/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useEffect, useMemo, useState } from 'react'
// Libraries
import algoliasearch from 'algoliasearch'
import {
	Configure,
	InstantSearch,
	Index,
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

// Types
import type { Hit } from 'instantsearch.js'
import type { ProductSlug } from 'types/products'
import type { SuggestedPage } from '../../../components'
// Styles
import s from './dialog-body.module.css'
import { tabsContentFromAlgoliaData } from '../unified-hits-container/helpers'

const ALGOLIA_INDEX_NAME = __config.dev_dot.algolia.unifiedIndexName

/**
 * Initialize the algolia search client.
 *
 * TODO(brkalow): We might consider lazy-loading the search client & the insights library
 */
const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY
const searchClient = algoliasearch(appId, apiKey)

// TODO: set up an enum for this, separate types file
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

const initialAlgoliaData: UnifiedSearchResults = {
	global: { hits: [] },
	docs: { hits: [] },
	integration: { hits: [] },
	tutorial: { hits: [] },
}

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
	// TODO: could split into a smaller component, then state might cause less updates
	const [algoliaData, setAlgoliaData] =
		useState<UnifiedSearchResults>(initialAlgoliaData)
	const currentProductTag = useCommandBarProductTag()
	const currentProductSlug = currentProductTag?.id as ProductSlug
	const recentSearches = useDebouncedRecentSearches(currentInputValue)

	function setHitData(type, hits) {
		setAlgoliaData((previous) => ({ ...previous, [type]: { hits } }))
	}

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
		<>
			<InstantSearch indexName={ALGOLIA_INDEX_NAME} searchClient={searchClient}>
				{['global', 'docs', 'integration', 'tutorial'].map(
					(type: 'global' | 'docs' | 'integration' | 'tutorial') => {
						return (
							<Index key={type} indexName={ALGOLIA_INDEX_NAME} indexId={type}>
								{/* TODO: is it possible to filter out not-yet-activated integrations for the all tab at this point? Maybe something like...
								(type:docs OR type:tutorial OR products:<withIntegrations> OR products<withIntegrations>),
								which should show 'docs' and 'tutorial' entries for ALL products,
								and should show integrations for all explicitly specified products.
								(with the optional AND (products:<product> OR edition:<product>)) */}
								<Configure
									query={currentInputValue}
									filters={getAlgoliaProductFilterString(
										currentProductSlug,
										type
									)}
								/>
								<HitsReporter setHits={(hits) => setHitData(type, hits)} />
							</Index>
						)
					}
				)}
			</InstantSearch>
			<CustomHitsContainer
				algoliaData={algoliaData}
				currentProductSlug={currentProductSlug}
				suggestedPages={suggestedPages}
			/>
		</>
	)
}

/**
 * TODO: this is meant as a non-rendering component to gather data
 * in a context, rather than entangle getting search results data
 * and rendering search results.
 *
 * TODO: maybe Algolia has a better way to do this?
 * All I really want to do is gather all `hitsData` across the three
 * different content type searches, and have that data accessible
 * so that I can render the presentational `UnifiedHitsContainer`.
 */
function HitsReporter({ setHits }: { setHits: $TSFixMe }) {
	const { hits } = useHits()

	/**
	 * When hits within this index context are updated,
	 * Update the <HitCountsProvider /> data for this content type.
	 */
	useEffect(() => setHits(hits), [hits])

	// This component doesn't render anything, it only gathers hit data
	return null
}

/**
 * Note: has to be a separate component, I think?
 */
function CustomHitsContainer({
	algoliaData,
	currentProductSlug,
	suggestedPages,
}: {
	algoliaData: $TSFixMe
	currentProductSlug?: ProductSlug
	suggestedPages: SuggestedPage[]
}) {
	/**
	 * Transform searchableContentTypes into data for each content tab.
	 *
	 * Note: we set up this data before rather than during render,
	 * because each tab needs data from all other tabs in order
	 * to show a helpful "No Results" message.
	 */
	const allTabData = useMemo(
		() => tabsContentFromAlgoliaData(algoliaData, currentProductSlug),
		[algoliaData, currentProductSlug]
	)

	return (
		<UnifiedHitsContainer
			tabData={allTabData}
			suggestedPages={suggestedPages}
		/>
	)
}
