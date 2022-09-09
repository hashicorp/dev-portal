import { useCallback, useMemo } from 'react'
import { useCurrentProduct } from 'contexts'
import { CommandBarTag, useCommandBar } from 'components/command-bar'
import { useSetUpAndCleanUpCommandState } from 'components/command-bar/hooks'
import { generateSuggestedPages } from './helpers/generate-suggested-pages'
import SuggestedPages, { SuggestedPage } from './suggested-pages'
import { ProductSlug } from 'types/products'

const SearchCommandBarDialogBody = () => {
	const { addTag, currentTags, removeTag } = useCommandBar()
	const currentProduct = useCurrentProduct()

	/**
	 * Generate suggested pages, memoized.
	 *
	 * NOTE: Can probably still be optimized by doing this in Command Bar, but
	 * waiting to abstract that far for now.
	 */
	const suggestedPages = useMemo<SuggestedPage[]>(() => {
		const currentProductTag = currentProduct
			? currentTags.find((tag: CommandBarTag) => tag.id === currentProduct.slug)
			: undefined
		return generateSuggestedPages(currentProductTag?.id as ProductSlug)
	}, [currentProduct, currentTags])

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
	 * @TODO only render `SuggestedPages` if the search query is empty. Need to
	 * hook up the command bar input into state first.
	 */
	return <SuggestedPages pages={suggestedPages} />
}

export default SearchCommandBarDialogBody
