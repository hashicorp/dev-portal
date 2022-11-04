import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import {
	AuthErrors,
	SessionData,
	UserData,
	ValidAuthProviderId,
} from 'types/auth'
import { UseAuthenticationOptions, UseAuthenticationResult } from './types'
import { signInWrapper, signOutWrapper, signUp } from './helpers'

export const DEFAULT_PROVIDER_ID = ValidAuthProviderId.CloudIdp

/**
 * Hook for consuming user, session, and authentication state. Sources all data
 * from next-auth/react's `useSession` hook.
 *
 * https://next-auth.js.org/getting-started/client#usesession
 */
const useAuthentication = (
	options: UseAuthenticationOptions = {}
): UseAuthenticationResult => {
	// Get option properties from `options` parameter
	const { isRequired = false, onUnauthenticated = () => signInWrapper() } =
		options

	// Pull data and status from next-auth's hook, and pass options
	const { data, status } = useSession({
		required: isRequired,
		onUnauthenticated,
	})

	/**
	 * Force sign in to hopefully resolve the error. The error is automatically
	 * cleared in the process of initiating the login flow via `signIn`.
	 *
	 * Because `signOutWrapper` has to be invoked to fully log out of the
	 * provider, users _should_ be re-signed in by this action without having to
	 * use the Cloud IDP sign in screen.
	 *
	 * https://next-auth.js.org/tutorials/refresh-token-rotation#client-side
	 */
	useEffect(() => {
		if (data?.error === AuthErrors.RefreshAccessTokenError) {
			signInWrapper()
		}
	}, [data?.error])

	// Deriving booleans about auth state
	const isLoading = status === 'loading'
	const isAuthenticated = status === 'authenticated'
	const showAuthenticatedUI = isAuthenticated
	const showUnauthenticatedUI = !isLoading && !isAuthenticated

	// Separating user and session data
	let session: SessionData, user: UserData
	if (isAuthenticated) {
		session = { ...data }
		user = data.user
		delete session.user
	}

	// Return everything packaged up in an object
	return {
		isAuthenticated,
		isLoading,
		session,
		showAuthenticatedUI,
		showUnauthenticatedUI,
		signIn: signInWrapper,
		signOut: signOutWrapper,
		signUp,
		status,
		user,
	}
}

export default useAuthentication
