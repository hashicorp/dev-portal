import { Command, SupportedCommand } from '../types'
import searchCommand from './search'
import settingsCommand from './settings'

const commands: Record<SupportedCommand, Command> = {
	search: searchCommand,
	settings: settingsCommand,
}

export default commands
