import { useCallback, useMemo } from 'react'
import { useCurrentProduct } from 'contexts'
import { useSetUpAndCleanUpCommandState } from 'components/command-bar/hooks'
import { useCommandBar } from 'components/command-bar'

const SearchCommandBarDialogBody = () => {
	const { addTag, removeTag } = useCommandBar()
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

	return <h1>Search Command Stuff</h1>
}

export default SearchCommandBarDialogBody
