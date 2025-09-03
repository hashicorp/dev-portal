'use client'

import {
	createContext,
	useContext,
	type MouseEventHandler,
	type RefObject,
} from 'react'

export interface MenuPrimitiveContextState {
	isOpen: boolean
	onClickToggle: MouseEventHandler<HTMLButtonElement>
	toggleRef: RefObject<HTMLDivElement>
	closeMenu: () => void
}

export const MenuPrimitiveContext = createContext<
	MenuPrimitiveContextState | undefined
>(undefined)
MenuPrimitiveContext.displayName = 'MenuPrimitiveContext'

export function useMenuPrimitive(): MenuPrimitiveContextState {
	const context = useContext(MenuPrimitiveContext)
	if (context === undefined) {
		throw new Error(
			'useMenuPrimitive must be used within a MenuPrimitiveContext.Provider'
		)
	}
	return context
}
