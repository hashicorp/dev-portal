'use client'
import { createContext, useContext, type MouseEventHandler } from 'react'

export interface DisclosurePrimitiveContextState {
	isOpen: boolean
	onClickToggle: MouseEventHandler<HTMLButtonElement>
	closeDisclosure: () => void
	contentId: string
	containsInteractive: boolean
	ariaLabel: string
}

export const DisclosurePrimitiveContext = createContext<
	DisclosurePrimitiveContextState | undefined
>(undefined)
DisclosurePrimitiveContext.displayName = 'DisclosurePrimitiveContext'

export function useDisclosurePrimitive(): DisclosurePrimitiveContextState {
	const context = useContext(DisclosurePrimitiveContext)
	if (context === undefined) {
		throw new Error(
			'useDisclosurePrimitive must be used within a DisclosurePrimitiveContext.Provider'
		)
	}
	return context
}
