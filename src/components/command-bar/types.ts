import { ReactNode } from 'react'

interface CommandBarProviderProps {
	children: ReactNode
}

interface CommandBarState {
	isOpen: boolean
	toggleIsOpen: () => void
}

export type { CommandBarState, CommandBarProviderProps }
