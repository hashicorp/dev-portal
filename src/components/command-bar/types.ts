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

type CommandBarTag = {
	id: string
	text: string
}

interface CommandBarProviderProps {
	children: ReactNode
}

interface CommandBarContextState {
	currentCommand: Command
	currentTags: CommandBarTag[]
	isOpen: boolean
}

interface CommandBarContextValue extends CommandBarContextState {
	addTag: (tag: CommandBarTag) => void
	removeTag: (tagId: CommandBarTag['id']) => void
	setCurrentCommand: (command: SupportedCommand) => void
	toggleIsOpen: () => void
}

export type {
	Command,
	CommandBarContextState,
	CommandBarContextValue,
	CommandBarProviderProps,
	CommandBarTag,
}
export { SupportedCommand }
