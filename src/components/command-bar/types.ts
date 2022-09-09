import { ReactElement, ReactNode } from 'react'

enum SupportedCommand {
	search = 'search',
	settings = 'settings',
}

interface CommandBarCommand {
	name: SupportedCommand
	icon: ReactElement
	inputProps: {
		placeholder: string
	}
	DialogBody?: () => ReactElement
}

type CommandBarTag = {
	id: string
	text: string
}

interface CommandBarProviderProps {
	children: ReactNode
}

interface CommandBarContextState {
	currentCommand: CommandBarCommand
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
	CommandBarCommand,
	CommandBarContextState,
	CommandBarContextValue,
	CommandBarProviderProps,
	CommandBarTag,
}
export { SupportedCommand }
