import { useCallback, useMemo } from 'react'
import { IconSearch24 } from '@hashicorp/flight-icons/svg-react/search-24'
import { useCurrentProduct } from 'contexts'
import {
	CommandBarCommand,
	SupportedCommand,
} from 'components/command-bar/types'
import { useSetUpAndCleanUpCommandState } from 'components/command-bar/hooks'
import { useCommandBar } from 'components/command-bar'

const DialogBody = () => {
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

const searchCommand: CommandBarCommand = {
	name: SupportedCommand.search,
	icon: <IconSearch24 />,
	inputProps: {
		placeholder: 'Search...',
	},
	DialogBody,
}

export default searchCommand
