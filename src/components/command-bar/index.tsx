import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react'
import commands from './commands'
import {
	CommandBarActivator,
	CommandBarDialog,
	CommandBarDialogHeader,
	CommandBarDialogBody,
	CommandBarDialogFooter,
} from './components'
import {
	CommandBarContextState,
	CommandBarContextValue,
	CommandBarProviderProps,
	SupportedCommand,
} from './types'
import s from './command-bar.module.css'

const GLOBAL_SEARCH_ENABLED = __config.flags.enable_global_search

const DEFAULT_CONTEXT_STATE: CommandBarContextState = {
	currentCommand: commands.search,
	isOpen: false,
}

/**
 * @TODO items that will be easier to implement when there is a text input
 * rendered in the header:
 *
 * - Render CommandBarDialog contents based on `currentCommand`
 *
 */

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
	const setCurrentCommand = useCallback((commandName: SupportedCommand) => {
		setState((prevState: CommandBarContextState) => ({
			...prevState,
			currentCommand: commands[commandName],
		}))
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
	const contextValue = useMemo(() => {
		return { ...state, setCurrentCommand, toggleIsOpen }
	}, [setCurrentCommand, state, toggleIsOpen])

	return (
		<CommandBarContext.Provider value={contextValue}>
			{children}
			<CommandBarDialog isOpen={state.isOpen} onDismiss={toggleIsOpen}>
				<CommandBarDialogHeader className={s.header} />
				<CommandBarDialogBody />
				<CommandBarDialogFooter>footer</CommandBarDialogFooter>
			</CommandBarDialog>
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

export {
	CommandBarActivator,
	CommandBarProvider,
	SupportedCommand,
	useCommandBar,
}
