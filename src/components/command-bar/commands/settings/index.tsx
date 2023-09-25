/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { IconSettings24 } from '@hashicorp/flight-icons/svg-react/settings-24'
import { CommandBarCommand } from 'components/command-bar/types'
import SettingsCommandBarDialogBody from './dialog-body'

const settingsCommand: CommandBarCommand = {
	name: 'settings',
	icon: <IconSettings24 />,
	inputProps: {
		placeholder: () => 'Settings...',
	},
	DialogBody: SettingsCommandBarDialogBody,
}

export default settingsCommand
