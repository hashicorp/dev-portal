import { ReactElement, ReactNode } from 'react'

enum SupportedCommand {
	search = 'search',
	settings = 'settings',
}

interface Command {
	name: SupportedCommand
	icon: ReactElement
	inputProps: {
		placeholder: string
	}
}

interface CommandBarProviderProps {
	children: ReactNode
}

interface CommandBarContextState {
	currentCommand: Command
	isOpen: boolean
}

interface CommandBarContextValue extends CommandBarContextState {
	setCurrentCommand: (command: SupportedCommand) => void
	toggleIsOpen: () => void
}

export type {
	Command,
	CommandBarContextState,
	CommandBarContextValue,
	CommandBarProviderProps,
}
export { SupportedCommand }
