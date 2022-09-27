import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useReducer,
} from 'react'
import useOnRouteChangeStart from 'hooks/use-on-route-change-start'
import commands from './commands'
import { CommandBarActivator, CommandBarDialog } from './components'
import {
	CommandBarCommand,
	CommandBarContextState,
	CommandBarContextValue,
	CommandBarProviderProps,
	CommandBarReducerAction,
	CommandBarTag,
	SupportedCommand,
} from './types'

const GLOBAL_SEARCH_ENABLED = __config.flags.enable_global_search

const DEFAULT_CONTEXT_STATE: CommandBarContextState = {
	currentCommand: commands.search,
	currentInputValue: '',
	currentTags: [],
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

const CommandBarProvider = ({ children }: CommandBarProviderProps) => {
	const [state, dispatch] = useReducer(commandBarReducer, DEFAULT_CONTEXT_STATE)

	/**
	 * Set up the callbacks for modifying state
	 */

	const toggleIsOpen = useCallback(() => {
		dispatch({ type: 'TOGGLE_IS_OPEN' })
	}, [])

	const setCurrentCommand = useCallback(
		(commandName: keyof typeof SupportedCommand) => {
			dispatch({ type: 'SET_CURRENT_COMMAND', value: commandName })
		},
		[]
	)

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
		if (!GLOBAL_SEARCH_ENABLED) {
			return
		}

		const handleKeyDown = (e: KeyboardEvent) => {
			const { ctrlKey, metaKey, key } = e
			if (key === 'k' && (ctrlKey || metaKey)) {
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
		<CommandBarContext.Provider value={contextValue}>
			{children}
			<CommandBarDialog isOpen={state.isOpen} onDismiss={toggleIsOpen} />
		</CommandBarContext.Provider>
	)
}

const useCommandBar = (): CommandBarContextValue => {
	const context = useContext(CommandBarContext)
	if (context === undefined) {
		throw new Error('useCommandBar must be used within a CommandBarProvider')
	}

	return context
}

export type { CommandBarCommand, CommandBarTag }
export {
	CommandBarActivator,
	CommandBarProvider,
	SupportedCommand,
	useCommandBar,
}
