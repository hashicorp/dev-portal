import { useCallback, useEffect, useMemo, useState } from 'react'
import algoliasearch from 'algoliasearch'
import { Configure, InstantSearch } from 'react-instantsearch-hooks-web'
import { IconDocs16 } from '@hashicorp/flight-icons/svg-react/docs-16'
import { IconLearn16 } from '@hashicorp/flight-icons/svg-react/learn-16'
import { ProductSlug } from 'types/products'
import { useCurrentContentType, useCurrentProduct } from 'contexts'
import { CommandBarTag, useCommandBar } from 'components/command-bar'
import { useSetUpAndCleanUpCommandState } from 'components/command-bar/hooks'
import Tabs, { Tab } from 'components/tabs'
import useRecentSearches from '../../hooks/use-recent-searches'
import {
	generateSuggestedPages,
	generateTutorialLibraryCta,
	getCurrentProductTag,
} from '../../helpers'
import {
	SuggestedPage,
	SuggestedPages,
	DocumentationTabContents,
	TutorialsTabContents,
	RecentSearches,
} from '../'
import s from './search-command-bar-dialog-body.module.css'

// TODO(brkalow): We might consider lazy-loading the search client & the insights library
const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY
const searchClient = algoliasearch(appId, apiKey)

const SearchCommandBarDialogBodyContent = ({
	currentProductTag,
	recentSearches,
}: {
	currentProductTag: CommandBarTag
	recentSearches: string[]
}) => {
	const { currentInputValue } = useCommandBar()
	const contentType = useCurrentContentType()

	/**
	 * Generate suggested pages, memoized.
	 */
	const suggestedPages = useMemo<SuggestedPage[]>(() => {
		return generateSuggestedPages(currentProductTag?.id as ProductSlug)
	}, [currentProductTag])

	return currentInputValue ? (
		<div className={s.tabsWrapper}>
			<Tabs
				showAnchorLine={false}
				initialActiveIndex={contentType === 'tutorials' ? 1 : 0}
				variant="compact"
			>
				<Tab heading="Documentation" icon={<IconDocs16 />}>
					<DocumentationTabContents
						currentProductTag={currentProductTag}
						suggestedPages={suggestedPages}
					/>
				</Tab>
				<Tab heading="Tutorials" icon={<IconLearn16 />}>
					<TutorialsTabContents
						currentProductTag={currentProductTag}
						tutorialLibraryCta={generateTutorialLibraryCta(currentProductTag)}
					/>
				</Tab>
			</Tabs>
		</div>
	) : (
		<div className={s.suggestedPagesWrapper}>
			<RecentSearches recentSearches={recentSearches} />
			<SuggestedPages pages={suggestedPages} />
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
			addTag({ id: currentProduct.slug, text: currentProduct.name })
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
