import { Session } from 'next-auth'
import { signIn, SignInOptions, signOut, SignOutParams } from 'next-auth/react'
import { SessionData, UserData, ValidAuthProviderId } from 'types/auth'
import { signUp } from './helpers'

interface UseAuthenticationOptions {
	/**
	 * Optional boolean. If true, `onUnauthenticated` is invoked if the user is
	 * not been authenticated.
	 */
	isRequired?: boolean

	/**
	 * Optional callback function. Invoked by next-auth when `isRequired` is true.
	 * By default, we invoke our custom `signIn` callback with no parameters.
	 */
	onUnauthenticated?: () => void
}

interface UseAuthenticationResult {
	isAuthenticated: boolean
	isLoading: boolean
	session: SessionData
	showAuthenticatedUI: boolean
	showUnauthenticatedUI: boolean
	signIn: (
		provider?: ValidAuthProviderId,
		options?: SignInOptions
	) => ReturnType<typeof signIn>
	signOut: (options?: SignOutParams) => ReturnType<typeof signOut>
	signUp: typeof signUp
	status: Session['status']
	user: null | UserData
}

export type { UseAuthenticationOptions, UseAuthenticationResult }
