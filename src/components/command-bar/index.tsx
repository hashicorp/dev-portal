import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react'
import commands from './commands'
import { CommandBarActivator, CommandBarDialog } from './components'
import {
	CommandBarCommand,
	CommandBarContextState,
	CommandBarContextValue,
	CommandBarProviderProps,
	CommandBarTag,
	SupportedCommand,
} from './types'

const GLOBAL_SEARCH_ENABLED = __config.flags.enable_global_search

const DEFAULT_CONTEXT_STATE: CommandBarContextState = {
	currentCommand: commands.search,
	currentTags: [],
	isOpen: false,
}

const CommandBarContext = createContext<CommandBarContextValue>(undefined)

const CommandBarProvider = ({ children }: CommandBarProviderProps) => {
	const [state, setState] = useState(DEFAULT_CONTEXT_STATE)

	/**
	 * Set up `toggleIsOpen` callback.
	 */
	const toggleIsOpen = useCallback(() => {
		setState((prevState: CommandBarContextState) => {
			const prevIsOpen = prevState.isOpen
			return { ...prevState, isOpen: !prevIsOpen }
		})
	}, [])

	/**
	 * Set up `setCurrentCommand` callback.
	 */
	const setCurrentCommand = useCallback(
		(commandName: keyof typeof SupportedCommand) => {
			setState((prevState: CommandBarContextState) => ({
				...prevState,
				currentCommand: commands[commandName],
			}))
		},
		[]
	)

	/**
	 * Set up `addTag` callback. Automatically handles checking for duplicates.
	 */
	const addTag = useCallback((newTag: CommandBarTag) => {
		setState((prevState: CommandBarContextState) => {
			const prevTags = prevState.currentTags

			// Check if the tag is already present
			const tagExists =
				prevTags.find((tag: CommandBarTag) => tag.id === newTag.id) !==
				undefined

			// Only add the new tag if it doesn't exist
			if (tagExists) {
				return prevState
			} else {
				return { ...prevState, currentTags: [...prevTags, newTag] }
			}
		})
	}, [])

	/**
	 * Set up `removeTag` callback.
	 */
	const removeTag = useCallback((tagId: CommandBarTag['id']) => {
		setState((prevState: CommandBarContextState) => {
			const prevTags = prevState.currentTags
			if (prevTags.length === 0) {
				return prevState
			} else {
				return {
					...prevState,
					currentTags: prevTags.filter(
						(tag: CommandBarTag) => tag.id !== tagId
					),
				}
			}
		})
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
	 * Memoize the Context value
	 */
	const contextValue = useMemo<CommandBarContextValue>(() => {
		return { ...state, addTag, removeTag, setCurrentCommand, toggleIsOpen }
	}, [addTag, removeTag, setCurrentCommand, state, toggleIsOpen])

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
