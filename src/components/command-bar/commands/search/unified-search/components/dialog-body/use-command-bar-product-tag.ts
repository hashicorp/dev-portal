import { useCallback, useMemo } from 'react'
import { useCommandBar } from 'components/command-bar'
import { useCurrentProduct } from 'contexts'
import { getCurrentProductTag } from '../../../helpers'
import { useSetUpAndCleanUpCommandState } from 'components/command-bar/hooks'

export function useCommandBarProductTag() {
	const currentProduct = useCurrentProduct()
	const { addTag, currentTags, removeTag } = useCommandBar()

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

	return currentProductTag
}
