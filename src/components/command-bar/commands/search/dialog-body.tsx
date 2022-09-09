import { useCallback, useMemo } from 'react'
import { useCurrentProduct } from 'contexts'
import { useCommandBar } from 'components/command-bar'
import { useSetUpAndCleanUpCommandState } from 'components/command-bar/hooks'
import { generateSuggestedPages } from './helpers/generate-suggested-pages'
import SuggestedPages from './suggested-pages'

const SearchCommandBarDialogBody = () => {
	const { addTag, currentTags, removeTag } = useCommandBar()
	const currentProduct = useCurrentProduct()

	/**
	 * Generate a CommandBarTag object if there is a `currentProduct`.
	 */
	const currentProductTag = useMemo(() => {
		if (currentProduct) {
			return { id: currentProduct.slug, text: currentProduct.name }
		}
	}, [currentProduct])

	/**
	 * Generate suggested pages, memoized.
	 *
	 * NOTE: Can probably still be optimized by doing this in Command Bar, but
	 * waiting to abstract that far for now.
	 */
	const suggestedPages = useMemo(() => {
		const hasTagForCurrentProduct =
			currentProduct &&
			currentTags.find((tag) => tag.id === currentProduct.slug)
		return generateSuggestedPages(
			hasTagForCurrentProduct ? currentProduct.slug : undefined
		)
	}, [currentProduct, currentTags])

	/**
	 * Create callback for setting up this command's state.
	 */
	const setUpCommandState = useCallback(() => {
		if (currentProductTag) {
			addTag(currentProductTag)
		}
	}, [addTag, currentProductTag])

	/**
	 * Create callback for cleaning up this command's state.
	 */
	const cleanUpCommandState = useCallback(() => {
		if (currentProductTag) {
			removeTag(currentProductTag.id)
		}
	}, [currentProductTag, removeTag])

	/**
	 * Leveraging the set up + clean up hook exposed by CommandBarDialog.
	 */
	useSetUpAndCleanUpCommandState(setUpCommandState, cleanUpCommandState)

	/**
	 * @TODO only render `SuggestedPages` if the search query is empty. Need to
	 * hook up the command bar input into state first.
	 */
	return <SuggestedPages pages={suggestedPages} />
}

export default SearchCommandBarDialogBody
