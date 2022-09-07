import { ReactNode } from 'react'

type SupportedCommand = 'search' | 'settings'

interface CommandBarProviderProps {
	children: ReactNode
}

interface CommandBarContextState {
	currentCommand: SupportedCommand
	isOpen: boolean
}

interface CommandBarContextValue extends CommandBarContextState {
	setCurrentCommand: (command: SupportedCommand) => void
	toggleIsOpen: () => void
}

export type {
	CommandBarContextState,
	CommandBarContextValue,
	CommandBarProviderProps,
	SupportedCommand,
}
