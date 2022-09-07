import { createContext, useContext, useEffect, useState } from 'react'
import { IconCode24 } from '@hashicorp/flight-icons/svg-react/code-24'
import { IconCommand16 } from '@hashicorp/flight-icons/svg-react/command-16'
import Badge from 'components/badge'
import {
	CommandBarActivator,
	CommandBarDialog,
	CommandBarDialogHeader,
	CommandBarDialogBody,
	CommandBarDialogFooter,
} from './components'
import { CommandBarProviderProps, CommandBarState } from './types'
import s from './command-bar.module.css'

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
	const [isOpen, setIsOpen] = useState<boolean>(false)

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
				setIsOpen((prevIsOpen: boolean) => !prevIsOpen)
			}
		}

		document.addEventListener('keydown', handleKeyDown)

		return () => {
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [])

	return (
		<CommandBarContext.Provider value={{ isOpen, setIsOpen }}>
			{children}
			<CommandBarDialog isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
				<CommandBarDialogHeader className={s.header}>
					<IconCode24 className={s.icon} />
					<input className={s.input} placeholder="Search..." />
					<div className={s.badges}>
						<Badge
							ariaLabel="Command key"
							color="neutral"
							icon={<IconCommand16 />}
							size="small"
							type="outlined"
						/>
						<Badge
							ariaLabel="K key"
							color="neutral"
							size="small"
							text="K"
							type="outlined"
						/>
					</div>
				</CommandBarDialogHeader>
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
