import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from 'react'
import { useRouter } from 'next/router'
import getCSSVariableFromDocument from 'lib/get-css-variable-from-document'
import { useNoScrollBody } from 'hooks/use-no-scroll-body'

const DEFAULT_NAV_HEADER_DESKTOP_WIDTH = 1201

interface MobileMenuContextState {
	/**
	 * Whether or not the screen size indicates that we should be rendering the mobile menu
	 */
	isMobileMenuRendered: boolean
	mobileMenuIsOpen: boolean
	setMobileMenuIsOpen: Dispatch<SetStateAction<boolean>>
}

interface MobileMenuProviderProps {
	children: ReactNode
}

const MobileMenuContext = createContext<MobileMenuContextState | undefined>(
	undefined
)
MobileMenuContext.displayName = 'MobileMenuContext'

/**
 * Provider for managing open/closed state of the mobile menu.
 */
const MobileMenuProvider = ({ children }: MobileMenuProviderProps) => {
	const router = useRouter()
	const [isMobileMenuRendered, setIsMobileMenuRendered] =
		useState<boolean>(false)
	const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState<boolean>()

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
			`(min-width: ${desktopWidthBreakpoint}px)`
		)

		// Create a change listener for the media query list object
		// Called when the breakpoint is crossed over in either direction
		const handleChange = () => {
			const shouldRenderMobileMenu = !mediaQueryListObject.matches
			setIsMobileMenuRendered(shouldRenderMobileMenu)
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
	useNoScrollBody(mobileMenuIsOpen)

	/**
	 * Handles closing the mobile menu in some cases.
	 */
	useEffect(() => {
		// Don't need to listen for router events on Desktop
		if (!isMobileMenuRendered) {
			// Close the mobile menu if the viewport size has crossed the breakpoint
			setMobileMenuIsOpen(false)
			return
		}

		// Close the mobile menu if it's open on route change start
		const handleRouteChange = () => {
			if (mobileMenuIsOpen) {
				setMobileMenuIsOpen(false)
			}
		}

		router.events.on('routeChangeComplete', handleRouteChange)
		router.events.on('routeChangeError', handleRouteChange)

		return () => {
			router.events.off('routeChangeComplete', handleRouteChange)
			router.events.off('routeChangeError', handleRouteChange)
		}
	}, [isMobileMenuRendered, mobileMenuIsOpen, router.events])

	const state: MobileMenuContextState = {
		isMobileMenuRendered,
		mobileMenuIsOpen,
		setMobileMenuIsOpen,
	}

	return (
		<MobileMenuContext.Provider value={state}>
			{children}
		</MobileMenuContext.Provider>
	)
}

/**
 * Hook for exposing menu state and the setter for updating the state.
 */
const useMobileMenu = (): MobileMenuContextState => {
	const context = useContext(MobileMenuContext)
	if (context === undefined) {
		throw new Error('useMobileMenu must be used within a MobileMenuProvider')
	}

	return context
}

export { MobileMenuProvider, useMobileMenu }
