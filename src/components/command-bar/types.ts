import { Dispatch, ReactNode, SetStateAction } from 'react'

interface CommandBarProviderProps {
	children: ReactNode
}

interface CommandBarState {
	isOpen: boolean
	setIsOpen: Dispatch<SetStateAction<boolean>>
}

export type { CommandBarState, CommandBarProviderProps }
