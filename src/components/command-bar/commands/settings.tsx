import { IconSettings24 } from '@hashicorp/flight-icons/svg-react/settings-24'
import { CommandBarCommand, SupportedCommand } from '../types'

const DialogBody = () => {
	return <h1>Sutff for Settings command</h1>
}

const settingsCommand: CommandBarCommand = {
	name: SupportedCommand.settings,
	icon: <IconSettings24 />,
	inputProps: {
		placeholder: 'Settings...',
	},
	DialogBody,
}

export default settingsCommand
