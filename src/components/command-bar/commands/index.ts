/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { CommandBarCommand, SupportedCommand } from 'components/command-bar'
import searchCommand from './search'
import settingsCommand from './settings'
import chatCommand from './chat'

const commands: Record<SupportedCommand, CommandBarCommand> = {
	search: searchCommand,
	settings: settingsCommand,
	chat: chatCommand,
}

export default commands
