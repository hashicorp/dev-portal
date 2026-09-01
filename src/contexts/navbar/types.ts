import { Dispatch, SetStateAction, ReactNode } from 'react'

export interface MobileMenuContextState {
	/**
	 * Whether or not the screen size indicates that we should be rendering the mobile menu
	 */
	isMobileMenuRendered: boolean
	mobileMenuIsOpen: boolean
	setMobileMenuIsOpen: Dispatch<SetStateAction<boolean>>
	currentMobileSubOption?: string
	setCurrentMobileSubOption?: Dispatch<SetStateAction<string>>
}

export interface MobileMenuProviderProps {
	children: ReactNode
}
