'use client'

import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'

export interface ModalContextState {
	isOpen: boolean
	openModal: (content: ReactNode) => void
	closeModal: () => void
}

export const ModalContext = createContext<ModalContextState | undefined>(
	undefined
)
ModalContext.displayName = 'ModalContext'

export function useModal(): ModalContextState {
	const context = useContext(ModalContext)
	if (context === undefined) {
		throw new Error('useModal must be used within a ModalContext.Provider')
	}
	return context
}
