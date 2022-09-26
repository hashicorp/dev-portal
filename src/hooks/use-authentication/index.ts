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

export const AUTH_ENABLED = __config.flags.enable_auth
export const DEFAULT_PROVIDER_ID = ValidAuthProviderId.CloudIdp
export const DEFAULT_SIGN_IN_CALLBACK_URL = '/profile/bookmarks'

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
		required: AUTH_ENABLED && isRequired,
		onUnauthenticated,
	})

	// Logout user if token refresh fails
	useEffect(() => {
		if (data?.error === AuthErrors.RefreshAccessTokenError) {
			signOutWrapper()
		}
	}, [data?.error])

	// Deriving booleans about auth state
	const isAuthEnabled = AUTH_ENABLED
	const isLoading = status === 'loading'
	const isAuthenticated = status === 'authenticated'
	const showAuthenticatedUI = isAuthenticated
	const showUnauthenticatedUI = isAuthEnabled && !isLoading && !isAuthenticated

	// Separating user and session data
	let session: SessionData, user: UserData
	if (isAuthenticated) {
		session = { ...data }
		user = data.user
		delete session.user
	}

	// Return everything packaged up in an object
	return {
		isAuthEnabled,
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
