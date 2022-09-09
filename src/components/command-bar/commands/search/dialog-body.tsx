import { useCallback, useMemo } from 'react'
import { useCurrentProduct } from 'contexts'
import { useCommandBar } from 'components/command-bar'
import { useSetUpAndCleanUpCommandState } from 'components/command-bar/hooks'
import SuggestedPages from './suggested-pages'
import { generateSuggestedPages } from './helpers/generate-suggested-pages'

const SearchCommandBarDialogBody = () => {
	const { addTag, removeTag } = useCommandBar()
	const currentProduct = useCurrentProduct()

	/**
	 * Generate suggested pages, memoized.
	 *
	 * NOTE: Can probably still be optimized by doing this in Command Bar, but
	 * waiting to abstract that far for now.
	 */
	const suggestedPages = useMemo(() => generateSuggestedPages(), [])

	/**
	 * Generate a CommandBarTag object if there is a `currentProduct`.
	 */
	const currentProductTag = useMemo(() => {
		if (currentProduct) {
			return { id: currentProduct.slug, text: currentProduct.name }
		}
	}, [currentProduct])

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
	return (
		<SuggestedPages
			pages={
				currentProduct
					? suggestedPages[currentProduct.slug]
					: suggestedPages.global
			}
		/>
	)
}

export default SearchCommandBarDialogBody
