/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useReducer,
	useRef,
} from 'react'
import useOnRouteChangeStart from 'hooks/use-on-route-change-start'
import commands from './commands'
import { CommandBarActivator, Command } from './components'
import SearchHitsProvider from './commands/search/helpers/hit-counts-provider'
import {
	CommandBarCommand,
	CommandBarContextState,
	CommandBarContextValue,
	CommandBarProviderProps,
	CommandBarReducerAction,
	CommandBarTag,
	SupportedCommand,
} from './types'

const DEFAULT_CONTEXT_STATE: CommandBarContextState = {
	currentCommand: commands.search,
	currentInputValue: '',
	currentTags: [],
	inputRef: null,
	isOpen: false,
}

const commandBarReducer = (
	state: CommandBarContextState,
	action: CommandBarReducerAction
): CommandBarContextState => {
	switch (action.type) {
		case 'ADD_TAG': {
			const newTag = action.value
			const previousCurrentTags = state.currentTags

			// Check if the tag is already present
			const tagExists =
				previousCurrentTags.find(
					(tag: CommandBarTag) => tag.id === newTag.id
				) !== undefined

			// Only add the new tag if it doesn't exist
			if (tagExists) {
				return state
			} else {
				return { ...state, currentTags: [...previousCurrentTags, newTag] }
			}
		}
		case 'REMOVE_TAG': {
			const tagId = action.value
			const previousCurrentTags = state.currentTags
			return {
				...state,
				currentTags: previousCurrentTags.filter(
					(tag: CommandBarTag) => tag.id !== tagId
				),
			}
		}
		case 'SET_CURRENT_COMMAND': {
			return { ...state, currentCommand: commands[action.value] }
		}
		case 'SET_CURRENT_INPUT_VALUE': {
			return { ...state, currentInputValue: action.value }
		}
		case 'TOGGLE_IS_OPEN': {
			const previousIsOpen = state.isOpen
			if (previousIsOpen) {
				// Reset state if we're closing the dialog
				return DEFAULT_CONTEXT_STATE
			} else {
				// Just update `isOpen` if we're opening the dialog
				return { ...state, isOpen: true }
			}
		}
	}
}

const CommandBarContext = createContext<CommandBarContextValue>(undefined)
CommandBarContext.displayName = 'CommandBarContext'

const CommandBarProvider = ({ children }: CommandBarProviderProps) => {
	const inputRef = useRef<HTMLInputElement>()
	const [state, dispatch] = useReducer(commandBarReducer, {
		...DEFAULT_CONTEXT_STATE,
		inputRef,
	})

	/**
	 * Set up the callbacks for modifying state
	 */

	const toggleIsOpen = useCallback(() => {
		dispatch({ type: 'TOGGLE_IS_OPEN' })
	}, [])

	const setCurrentCommand = useCallback((commandName: SupportedCommand) => {
		dispatch({ type: 'SET_CURRENT_COMMAND', value: commandName })
	}, [])

	const addTag = useCallback((newTag: CommandBarTag) => {
		dispatch({ type: 'ADD_TAG', value: newTag })
	}, [])

	const removeTag = useCallback((tagId: CommandBarTag['id']) => {
		dispatch({ type: 'REMOVE_TAG', value: tagId })
	}, [])

	const setCurrentInputValue = useCallback((newValue: string) => {
		dispatch({ type: 'SET_CURRENT_INPUT_VALUE', value: newValue })
	}, [])

	/**
	 * Set up the cmd/ctrl + k keydown listener.
	 */
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const { ctrlKey, metaKey, key } = e
			if (key === 'k' && (ctrlKey || metaKey)) {
				e.preventDefault()
				toggleIsOpen()
			}
		}

		document.addEventListener('keydown', handleKeyDown)

		return () => {
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [toggleIsOpen])

	/**
	 * If it is open, handle closing the dialog on `routeChangeStart`.
	 */
	useOnRouteChangeStart({ handler: toggleIsOpen, shouldListen: state.isOpen })

	/**
	 * Memoize the Context value
	 */
	const contextValue = useMemo<CommandBarContextValue>(() => {
		return {
			...state,
			addTag,
			removeTag,
			setCurrentCommand,
			setCurrentInputValue,
			toggleIsOpen,
			instructionsElementId: 'footer-keyboard-instructions',
		}
	}, [
		addTag,
		removeTag,
		setCurrentCommand,
		setCurrentInputValue,
		state,
		toggleIsOpen,
	])

	return (
		<SearchHitsProvider>
			<CommandBarContext.Provider value={contextValue}>
				{children}
				<Command.Dialog isOpen={state.isOpen} onDismiss={toggleIsOpen}>
					<Command.Header />
					<Command.Body />
					{
						// TODO(kevinwang): This conditional needs an abstraction
						state.currentCommand.name == 'chat' ? null : <Command.Footer />
					}
				</Command.Dialog>
			</CommandBarContext.Provider>
		</SearchHitsProvider>
	)
}

const useCommandBar = (): CommandBarContextValue => {
	const context = useContext(CommandBarContext)
	if (context === undefined) {
		throw new Error('useCommandBar must be used within a CommandBarProvider')
	}

	return context
}

export type { CommandBarCommand, CommandBarTag, SupportedCommand }
export { CommandBarActivator, CommandBarProvider, useCommandBar }
