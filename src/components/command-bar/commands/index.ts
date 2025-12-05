/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { CommandBarCommand, SupportedCommand } from 'components/command-bar'
import searchCommand from './search'
import settingsCommand from './settings'

const commands: Record<SupportedCommand, CommandBarCommand> = {
	search: searchCommand,
	settings: settingsCommand,
}

export default commands
