import { IconSettings24 } from '@hashicorp/flight-icons/svg-react/settings-24'
import {
	CommandBarCommand,
	SupportedCommand,
} from 'components/command-bar/types'
import SettingsCommandBarDialogBody from './dialog-body'

const settingsCommand: CommandBarCommand = {
	name: SupportedCommand.settings,
	icon: <IconSettings24 />,
	inputProps: {
		placeholder: 'Settings...',
	},
	DialogBody: SettingsCommandBarDialogBody,
}

export default settingsCommand
