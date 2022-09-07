import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react'
import {
	CommandBarActivator,
	CommandBarDialog,
	CommandBarDialogHeader,
	CommandBarDialogBody,
	CommandBarDialogFooter,
} from './components'
import { CommandBarProviderProps, CommandBarState } from './types'

const GLOBAL_SEARCH_ENABLED = __config.flags.enable_global_search

/**
 * @TODO items that will be easier to implement when there is a text input
 * rendered in the header:
 *
 * - Add `currentCommand` to state
 * - Render CommandBarDialog contents based on `currentCommand`
 * - Expose a `setCurrentCommand` function in `CommandBarState`
 *
 */

const CommandBarContext = createContext<CommandBarState>(undefined)

const CommandBarProvider = ({ children }: CommandBarProviderProps) => {
	const [state, setState] = useState({
		isOpen: false,
	})

	const toggleIsOpen = useCallback(() => {
		setState((prevState) => {
			const prevIsOpen = prevState.isOpen
			return { ...prevState, isOpen: !prevIsOpen }
		})
	}, [])

	/**
	 * Sets up the cmd/ctrl + k keydown listener.
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
	}, [])

	return (
		<CommandBarContext.Provider value={{ ...state, toggleIsOpen }}>
			{children}
			<CommandBarDialog isOpen={state.isOpen} onDismiss={toggleIsOpen}>
				<CommandBarDialogHeader>header</CommandBarDialogHeader>
				<CommandBarDialogBody>body</CommandBarDialogBody>
				<CommandBarDialogFooter>footer</CommandBarDialogFooter>
			</CommandBarDialog>
		</CommandBarContext.Provider>
	)
}

const useCommandBar = () => {
	const context = useContext(CommandBarContext)
	if (context === undefined) {
		throw new Error('useCommandBar must be used within a CommandBarProvider')
	}

	return context
}

export type { CommandBarState }
export { CommandBarActivator, CommandBarProvider, useCommandBar }
