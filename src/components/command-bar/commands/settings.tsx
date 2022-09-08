import { IconSettings24 } from '@hashicorp/flight-icons/svg-react/settings-24'
import { SupportedCommand } from '../types'

const settingsCommand = {
	name: SupportedCommand.settings,
	icon: <IconSettings24 />,
	inputProps: {
		placeholder: 'Settings...',
	},
}

export default settingsCommand
