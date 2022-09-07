import { IconSearch24 } from '@hashicorp/flight-icons/svg-react/search-24'
import { SupportedCommand } from '../types'

const searchCommand = {
	name: SupportedCommand.search,
	icon: <IconSearch24 />,
	inputProps: {
		placeholder: 'Search...',
	},
}

export default searchCommand
