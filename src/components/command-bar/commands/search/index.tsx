import { IconSearch24 } from '@hashicorp/flight-icons/svg-react/search-24'
import {
	CommandBarCommand,
	SupportedCommand,
} from 'components/command-bar/types'
import { getCurrentProductTag } from './helpers'
import SearchCommandBarDialogBody from './components/dialog-body'

type Options = Parameters<CommandBarCommand['inputProps']['placeholder']>[0]

const generatePlaceholder = (options: Options) => {
	let placeholderText

	const { commandBarState, currentProduct } = options
	const currentProductTag = getCurrentProductTag({
		currentProduct,
		currentTags: commandBarState.currentTags,
	})

	if (currentProductTag) {
		placeholderText = `Search ${currentProduct.name}`
	} else {
		placeholderText = 'Search all products'
	}

	return `${placeholderText}...`
}

const searchCommand: CommandBarCommand = {
	name: SupportedCommand.search,
	icon: <IconSearch24 />,
	inputProps: {
		placeholder: generatePlaceholder,
	},
	DialogBody: SearchCommandBarDialogBody,
}

export default searchCommand
