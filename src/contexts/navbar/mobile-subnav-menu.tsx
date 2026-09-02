/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { createContext, useContext, useEffect, useState } from 'react'
import { MobileSubMenuContextState, MobileMenuProviderProps } from './types'
import { useRouter } from 'next/router'
import getCSSVariableFromDocument from 'lib/get-css-variable-from-document'
import { useNoScrollBody } from 'hooks/use-no-scroll-body'

/**
 * Should correspond to --dev-dot-hide-mobile-menu
 */
const DEFAULT_NAV_HEADER_DESKTOP_WIDTH = 924

const MobileSubMenuContext = createContext<
	MobileSubMenuContextState | undefined
>(undefined)
MobileSubMenuContext.displayName = 'MobileSubMenuContext'

/**
 * Provider for managing open/closed state of the mobile menu.
 */
const MobileSubMenuProvider = ({ children }: MobileMenuProviderProps) => {
	const router = useRouter()
	const [isMobileSubMenuRendered, setIsMobileSubMenuRendered] =
		useState<boolean>(false)
	const [mobileSubMenuIsOpen, setMobileSubMenuIsOpen] = useState<boolean>()

	/**
	 * NOTE: We cannot use `useDeviceSize` here because the nav header
	 * breakpoints are different than the breakpoints used elsewhere in the app.
	 */
	useEffect(() => {
		if (typeof window === 'undefined') {
			return
		}

		// Get the breakpoint value
		const desktopWidthBreakpoint =
			(getCSSVariableFromDocument('--mobile-menu-breakpoint', {
				asNumber: true,
			}) as number) || DEFAULT_NAV_HEADER_DESKTOP_WIDTH

		// Create a media query list object with the obtained breakpoint
		const mediaQueryListObject = window.matchMedia(
			`(min-width: ${desktopWidthBreakpoint}px)`,
		)

		// Create a change listener for the media query list object
		// Called when the breakpoint is crossed over in either direction
		const handleChange = () => {
			const shouldRenderMobileMenu = !mediaQueryListObject.matches
			setIsMobileSubMenuRendered(shouldRenderMobileMenu)
		}

		// Set the initial state based on the mediaQuery
		handleChange()

		// Add change listener
		mediaQueryListObject.addEventListener('change', handleChange)

		// Clean up; remove change listener
		return () => {
			mediaQueryListObject.removeEventListener('change', handleChange)
		}
	}, [])

	/**
	 * Prevents scrolling on the rest of the page body
	 */
	useNoScrollBody(mobileSubMenuIsOpen)

	/**
	 * Handles closing the mobile menu in some cases.
	 */
	useEffect(() => {
		// Don't need to listen for router events on Desktop
		if (!isMobileSubMenuRendered) {
			// Close the mobile menu if the viewport size has crossed the breakpoint
			setMobileSubMenuIsOpen(false)
			return
		}

		// Close the mobile sub menu if it's open on route change start
		const handleRouteChange = () => {
			if (mobileSubMenuIsOpen) {
				setMobileSubMenuIsOpen(false)
			}
		}

		router.events.on('routeChangeComplete', handleRouteChange)
		router.events.on('routeChangeError', handleRouteChange)
		router.events.on('hashChangeComplete', handleRouteChange)

		return () => {
			router.events.off('routeChangeComplete', handleRouteChange)
			router.events.off('routeChangeError', handleRouteChange)
			router.events.off('hashChangeComplete', handleRouteChange)
		}
	}, [isMobileSubMenuRendered, mobileSubMenuIsOpen, router.events])

	const state: MobileSubMenuContextState = {
		isMobileSubMenuRendered,
		mobileSubMenuIsOpen,
		setMobileSubMenuIsOpen,
	}

	return (
		<MobileSubMenuContext.Provider value={state}>
			{children}
		</MobileSubMenuContext.Provider>
	)
}

/**
 * Hook for exposing menu state and the setter for updating the state.
 */
const useMobileSubMenu = (): MobileSubMenuContextState => {
	const context = useContext(MobileSubMenuContext)
	if (context === undefined) {
		throw new Error(
			'useMobileSubMenu must be used within a MobileSubMenuProvider',
		)
	}

	return context
}

export { MobileSubMenuProvider, useMobileSubMenu }
