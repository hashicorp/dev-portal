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

interface ToggleIsOpenAction {
	type: 'TOGGLE_IS_OPEN'
}

interface SetCurrentCommandAction {
	type: 'SET_CURRENT_COMMAND'
	value: keyof typeof SupportedCommand
}

interface AddTagAction {
	type: 'ADD_TAG'
	value: CommandBarTag
}

interface RemoveTagAction {
	type: 'REMOVE_TAG'
	value: CommandBarTag['id']
}

type CommandBarReducerAction =
	| ToggleIsOpenAction
	| SetCurrentCommandAction
	| AddTagAction
	| RemoveTagAction

export type {
	CommandBarCommand,
	CommandBarContextState,
	CommandBarContextValue,
	CommandBarProviderProps,
	CommandBarReducerAction,
	CommandBarTag,
}
export { SupportedCommand }
