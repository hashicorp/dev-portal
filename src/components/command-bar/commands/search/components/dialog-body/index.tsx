import { useCallback, useMemo, useState } from 'react'
import { ProductSlug } from 'types/products'
import { useCurrentContentType, useCurrentProduct } from 'contexts'
import { useCommandBar } from 'components/command-bar'
import { useSetUpAndCleanUpCommandState } from 'components/command-bar/hooks'
import Tabs, { Tab } from 'components/tabs'
import { generateSuggestedPages } from '../../helpers/generate-suggested-pages'
import SuggestedPages, { SuggestedPage } from '../../suggested-pages'
import { getCurrentProductTag } from '../../helpers/get-current-product-tag'
import DocumentationTabContents from '../documentation-tab-contents'
import TutorialsTabContents from '../tutorials-tab-contents'

const DEFAULT_SEARCH_RESULTS = {
	docs: [],
	tutorials: [],
}

const SearchCommandBarDialogBody = () => {
	const { addTag, currentInputValue, currentTags, removeTag } = useCommandBar()
	const currentProduct = useCurrentProduct()
	const contentType = useCurrentContentType()

	// TODO `setSearchResults` will be used soon
	const [searchResults, setSearchResults] = useState(DEFAULT_SEARCH_RESULTS)

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
	 *
	 * NOTE: Can probably still be optimized by doing this in Command Bar, but
	 * waiting to abstract that far for now.
	 */
	const suggestedPages = useMemo<SuggestedPage[]>(() => {
		return generateSuggestedPages(currentProductTag?.id as ProductSlug)
	}, [currentProductTag])

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

	return (
		<>
			{currentInputValue ? (
				<Tabs
					showAnchorLine={false}
					initialActiveIndex={contentType === 'tutorials' ? 1 : 0}
				>
					<Tab heading="Documentation">
						<DocumentationTabContents
							searchResults={searchResults.docs}
							suggestedPages={suggestedPages}
						/>
					</Tab>
					<Tab heading="Tutorials">
						<TutorialsTabContents
							searchResults={searchResults.tutorials}
							tutorialLibraryCta={{
								href: currentProductTag
									? `/tutorials/library?product=${currentProductTag.id}`
									: '/tutorials/library',
								text: currentProductTag
									? `See all ${currentProductTag.text} tutorials in the Tutorial Library`
									: 'See all tutorials in the Tutorial Library',
							}}
						/>
					</Tab>
				</Tabs>
			) : (
				<SuggestedPages pages={suggestedPages} />
			)}
		</>
	)
}

export default SearchCommandBarDialogBody
