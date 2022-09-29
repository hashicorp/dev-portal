import { MutableRefObject, ReactElement, ReactNode } from 'react'
import { ProductData } from 'types/products'

enum SupportedCommand {
	search = 'search',
	settings = 'settings',
}

interface CommandBarCommand {
	name: SupportedCommand
	icon: ReactElement
	inputProps: {
		placeholder: ({
			commandBarState,
			currentProduct,
		}: {
			commandBarState: CommandBarContextState
			currentProduct: ProductData
		}) => string
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
	currentInputValue: string
	currentTags: CommandBarTag[]
	inputRef: MutableRefObject<HTMLInputElement>
	isOpen: boolean
}

interface CommandBarContextValue extends CommandBarContextState {
	addTag: (newTag: CommandBarTag) => void
	removeTag: (tagId: CommandBarTag['id']) => void
	setCurrentCommand: (command: SupportedCommand) => void
	setCurrentInputValue: (newValue: string) => void
	toggleIsOpen: () => void
}

interface AddTagAction {
	type: 'ADD_TAG'
	value: CommandBarTag
}

interface RemoveTagAction {
	type: 'REMOVE_TAG'
	value: CommandBarTag['id']
}

interface SetCurrentCommandAction {
	type: 'SET_CURRENT_COMMAND'
	value: keyof typeof SupportedCommand
}

interface SetCurrentInputValueAction {
	type: 'SET_CURRENT_INPUT_VALUE'
	value: string
}

interface ToggleIsOpenAction {
	type: 'TOGGLE_IS_OPEN'
}

type CommandBarReducerAction =
	| AddTagAction
	| RemoveTagAction
	| SetCurrentCommandAction
	| SetCurrentInputValueAction
	| ToggleIsOpenAction

export type {
	CommandBarCommand,
	CommandBarContextState,
	CommandBarContextValue,
	CommandBarProviderProps,
	CommandBarReducerAction,
	CommandBarTag,
}
export { SupportedCommand }
