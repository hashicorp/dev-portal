import { Session } from 'next-auth'
import { SessionData, UserData } from 'types/auth'
import { signInWrapper, signOutWrapper, signUp } from './helpers'

interface UseAuthenticationOptions {
	/**
	 * Optional boolean. If true, `onUnauthenticated` is invoked if the user is
	 * not been authenticated.
	 */
	isRequired?: boolean

	/**
	 * Optional callback function. Invoked by next-auth when `isRequired` is true.
	 * By default, we invoke `signInWrapper` with no parameters.
	 */
	onUnauthenticated?: () => void
}

interface UseAuthenticationResult {
	isAuthEnabled: boolean
	isAuthenticated: boolean
	isLoading: boolean
	session: SessionData
	showAuthenticatedUI: boolean
	showUnauthenticatedUI: boolean
	signIn: typeof signInWrapper
	signOut: typeof signOutWrapper
	signUp: typeof signUp
	status: Session['status']
	user: null | UserData
}

export type { UseAuthenticationOptions, UseAuthenticationResult }
