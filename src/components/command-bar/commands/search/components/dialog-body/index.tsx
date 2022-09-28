import { useCallback, useEffect, useMemo, useState } from 'react'
import algoliasearch from 'algoliasearch'
import { Configure, InstantSearch } from 'react-instantsearch-hooks-web'
import { IconDocs16 } from '@hashicorp/flight-icons/svg-react/docs-16'
import { IconHistory16 } from '@hashicorp/flight-icons/svg-react/history-16'
import { IconLearn16 } from '@hashicorp/flight-icons/svg-react/learn-16'
import { ProductSlug } from 'types/products'
import { useCurrentContentType, useCurrentProduct } from 'contexts'
import { CommandBarTag, useCommandBar } from 'components/command-bar'
import { useSetUpAndCleanUpCommandState } from 'components/command-bar/hooks'
import {
	CommandBarButtonListItem,
	CommandBarDivider,
	CommandBarList,
} from 'components/command-bar/components'
import Tabs, { Tab } from 'components/tabs'
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
} from '../'
import s from './search-command-bar-dialog-body.module.css'

// TODO(brkalow): We might consider lazy-loading the search client & the insights library
const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY
const searchClient = algoliasearch(appId, apiKey)

const SearchCommandBarDialogBodyContent = ({
	currentProductTag,
}: {
	currentProductTag: CommandBarTag
}) => {
	const { currentInputValue } = useCommandBar()
	const contentType = useCurrentContentType()

	/**
	 * Generate suggested pages, memoized.
	 */
	const suggestedPages = useMemo<SuggestedPage[]>(() => {
		return generateSuggestedPages(currentProductTag?.id as ProductSlug)
	}, [currentProductTag])

	let recentSearches
	if (typeof window !== 'undefined') {
		const storageValue = JSON.parse(
			window.localStorage.getItem('RECENT_SEARCHES')
		) as string[]

		if (storageValue.length > 0) {
			recentSearches = (
				<>
					<CommandBarList label="Recent Searches">
						{storageValue.reverse().map((recent) => {
							return (
								<CommandBarButtonListItem
									key={recent}
									icon={<IconHistory16 />}
									onClick={() => console.log('clicked', recent)}
									title={recent}
								/>
							)
						})}
					</CommandBarList>
					<CommandBarDivider />
				</>
			)
		}
	}

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
			{recentSearches}
			<SuggestedPages pages={suggestedPages} />
		</div>
	)
}

const SearchCommandBarDialogBody = () => {
	const currentProduct = useCurrentProduct()
	const { addTag, currentInputValue, currentTags, removeTag } = useCommandBar()
	const [searchQuery, setSearchQuery] = useState(undefined)

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
	 * Handle updating local storage when the `searchQuery` updates.
	 */
	useEffect(() => {
		if (typeof window === 'undefined' || !searchQuery) {
			return
		}

		const localStorage = window.localStorage
		const rawValue = localStorage.getItem('RECENT_SEARCHES')
		const recentSearches = rawValue ? JSON.parse(rawValue) : []

		if (!recentSearches || recentSearches.length === 0) {
			localStorage.setItem('RECENT_SEARCHES', JSON.stringify([searchQuery]))
			return
		}

		const indexOfQuery = recentSearches.indexOf(searchQuery)
		if (indexOfQuery >= 0) {
			recentSearches.splice(indexOfQuery, 1)
		}

		recentSearches.push(searchQuery)

		let newValue = recentSearches
		if (recentSearches.length > 3) {
			newValue = recentSearches.slice(-3)
		}

		localStorage.setItem('RECENT_SEARCHES', JSON.stringify(newValue))
	}, [searchQuery])

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
			/>
		</InstantSearch>
	)
}

export default SearchCommandBarDialogBody
