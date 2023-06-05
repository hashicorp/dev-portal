/**
 * Copyright (c) HashiCorp, Inc.
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
