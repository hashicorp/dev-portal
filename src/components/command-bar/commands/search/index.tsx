import { IconSearch24 } from '@hashicorp/flight-icons/svg-react/search-24'
import {
	CommandBarCommand,
	SupportedCommand,
} from 'components/command-bar/types'
import SearchCommandBarDialogBody from './components/dialog-body'

const searchCommand: CommandBarCommand = {
	name: SupportedCommand.search,
	icon: <IconSearch24 />,
	inputProps: {
		placeholder: 'Search...',
	},
	DialogBody: SearchCommandBarDialogBody,
}

export default searchCommand
