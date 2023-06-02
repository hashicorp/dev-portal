/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useCallback, useEffect, useMemo, useState } from 'react'
import algoliasearch from 'algoliasearch'
import { Configure, InstantSearch } from 'react-instantsearch-hooks-web'
import { useCurrentProduct } from 'contexts'
import { useCommandBar } from 'components/command-bar'
import { useSetUpAndCleanUpCommandState } from 'components/command-bar/hooks'
import useRecentSearches from '../../../hooks/use-recent-searches'
import { generateSuggestedPages, getCurrentProductTag } from '../../../helpers'
import { UnifiedSearchDialogContents } from '../dialog-contents'
// Types
import type { SuggestedPage } from '../../../components'
import type { ProductSlug } from 'types/products'

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
	const currentProduct = useCurrentProduct()
	const { addTag, currentInputValue, currentTags, removeTag } = useCommandBar()
	const [searchQuery, setSearchQuery] = useState(undefined)
	const { recentSearches, addRecentSearch } = useRecentSearches()

	/**
	 * Delay sending off search queries while the user is typing.
	 */
	useEffect(() => {
		const typingDebounce = setTimeout(() => {
			setSearchQuery(currentInputValue)
		}, 300)

		return () => clearTimeout(typingDebounce)
	}, [currentInputValue])

	/**
	 * Add a new recent search when `searchQuery` updates.
	 */
	useEffect(() => {
		addRecentSearch(searchQuery)
	}, [addRecentSearch, searchQuery])

	/**
	 * Create callback for setting up this command's state.
	 */
	const setUpCommandState = useCallback(() => {
		if (currentProduct) {
			addTag({
				id: currentProduct.slug,
				text: currentProduct.slug === 'hcp' ? 'HCP' : currentProduct.name,
			})
		}
	}, [addTag, currentProduct])

	/**
	 * Create callback for cleaning up this command's state.
	 */
	const cleanUpCommandState = useCallback(() => {
		if (currentProduct) {
			removeTag(currentProduct.slug)
		}
	}, [currentProduct, removeTag])

	/**
	 * Leveraging the set up + clean up hook exposed by CommandBarDialog.
	 */
	useSetUpAndCleanUpCommandState(setUpCommandState, cleanUpCommandState)

	/**
	 * Get the CommandBarTag object for the current product if it's present.
	 */
	const currentProductTag = useMemo(
		() =>
			getCurrentProductTag({
				currentProduct,
				currentTags,
			}),
		[currentProduct, currentTags]
	)

	/**
	 * Generate suggested pages, memoized.
	 */
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
