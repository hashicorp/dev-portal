/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useCallback, useEffect, useMemo, useState } from 'react'
import algoliasearch from 'algoliasearch'
import { Configure, InstantSearch } from 'react-instantsearch-hooks-web'
import { IconDocs16 } from '@hashicorp/flight-icons/svg-react/docs-16'
import { IconLearn16 } from '@hashicorp/flight-icons/svg-react/learn-16'
import { IconPipeline16 } from '@hashicorp/flight-icons/svg-react/pipeline-16'
import { ProductSlug } from 'types/products'
import {
	SearchableContentType,
	useCurrentContentType,
	useCurrentProduct,
} from 'contexts'
import { CommandBarTag, useCommandBar } from 'components/command-bar'
import { useSetUpAndCleanUpCommandState } from 'components/command-bar/hooks'
import Tabs, { Tab } from 'components/tabs'
import { TabProps } from 'components/tabs/components/tab'
import useRecentSearches from '../../hooks/use-recent-searches'
import {
	generateSuggestedPages,
	generateTutorialLibraryCta,
	getCurrentProductTag,
	useHitsContext,
} from '../../helpers'
import {
	DocumentationTabContents,
	IntegrationsTabContents,
	RecentSearches,
	SuggestedPage,
	SuggestedPages,
	TutorialsTabContents,
} from '../'
import s from './search-command-bar-dialog-body.module.css'

// TODO(brkalow): We might consider lazy-loading the search client & the insights library
const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY
const searchClient = algoliasearch(appId, apiKey)

const PRODUCT_SLUGS_WITH_INTEGRATIONS =
	__config.dev_dot.product_slugs_with_integrations

interface SearchableContentTypeTab {
	heading: TabProps['heading']
	icon: TabProps['icon']
	content: TabProps['children']
}

const SearchCommandBarDialogBodyContent = ({
	currentProductTag,
	recentSearches,
}: {
	currentProductTag: CommandBarTag
	recentSearches: string[]
}) => {
	const { currentInputValue } = useCommandBar()
	const contentType = useCurrentContentType()
	const [hitCounts] = useHitsContext()

	/**
	 * Generate suggested pages, memoized.
	 */
	const suggestedPages = useMemo<SuggestedPage[]>(() => {
		return generateSuggestedPages(currentProductTag?.id as ProductSlug)
	}, [currentProductTag])

	/**
	 * Generate an object used to render all of the Tab elements to preselect the
	 * Tab for the CurrentContentType.
	 */
	const tabsBySearchableContentType = useMemo<
		Record<SearchableContentType, SearchableContentTypeTab>
	>(() => {
		return {
			docs: {
				heading: 'Documentation',
				icon: <IconDocs16 />,
				content: (
					<DocumentationTabContents
						currentProductTag={currentProductTag}
						suggestedPages={suggestedPages}
					/>
				),
			},
			tutorials: {
				heading: 'Tutorials',
				icon: <IconLearn16 />,
				content: (
					<TutorialsTabContents
						currentProductTag={currentProductTag}
						tutorialLibraryCta={generateTutorialLibraryCta(currentProductTag)}
					/>
				),
			},
			integrations: {
				heading: 'Integrations',
				icon: <IconPipeline16 />,
				content: (
					<IntegrationsTabContents currentProductTag={currentProductTag} />
				),
			},
		}
	}, [currentProductTag, suggestedPages])
	const searchableContentTypes = Object.keys(tabsBySearchableContentType)
	const activeTabIndex =
		contentType === 'global' ? 0 : searchableContentTypes.indexOf(contentType)

	/**
	 * Don't render search result Tabs at all if there is no text in the input.
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
	 * Determine whether the Integrations tab should be rendered.
	 */
	let shouldRenderIntegrationsTab
	if (PRODUCT_SLUGS_WITH_INTEGRATIONS.length <= 0) {
		// If no products have integrations, do not render it
		shouldRenderIntegrationsTab = false
	} else if (currentProductTag) {
		// If there is a product tag, render it if the product has integrations
		const productHasIntegrations = PRODUCT_SLUGS_WITH_INTEGRATIONS.includes(
			currentProductTag.id
		)
		shouldRenderIntegrationsTab = productHasIntegrations
	} else {
		// Otherwise search is across all products, so render it
		shouldRenderIntegrationsTab = true
	}

	return (
		<div className={s.tabsWrapper}>
			<Tabs
				showAnchorLine={false}
				initialActiveIndex={activeTabIndex}
				variant="compact"
			>
				{searchableContentTypes.map((contentType: SearchableContentType) => {
					if (contentType === 'integrations' && !shouldRenderIntegrationsTab) {
						return null
					}

					const { heading, icon, content } =
						tabsBySearchableContentType[contentType]
					return (
						<Tab
							heading={`${heading} (${hitCounts[contentType]})`}
							icon={icon}
							key={contentType}
						>
							{content}
						</Tab>
					)
				})}
			</Tabs>
		</div>
	)
}

const SearchCommandBarDialogBody = () => {
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

	return (
		<InstantSearch
			indexName={__config.dev_dot.algolia.tutorialsIndexName}
			searchClient={searchClient}
		>
			<Configure query={searchQuery} />
			<SearchCommandBarDialogBodyContent
				currentProductTag={currentProductTag}
				recentSearches={recentSearches}
			/>
		</InstantSearch>
	)
}

export default SearchCommandBarDialogBody
