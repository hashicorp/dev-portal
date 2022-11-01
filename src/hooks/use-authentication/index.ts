import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { saveAndLoadAnalytics } from '@hashicorp/react-consent-manager'
import { loadPreferences } from '@hashicorp/react-consent-manager/util/cookies'
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

	// Logout user if token refresh fails
	useEffect(() => {
		if (data?.error === AuthErrors.RefreshAccessTokenError) {
			signOutWrapper()
		}
	}, [data?.error])

	// Deriving booleans about auth state
	const isLoading = status === 'loading'
	const isAuthenticated = status === 'authenticated'
	const showAuthenticatedUI = isAuthenticated
	const showUnauthenticatedUI = !isLoading && !isAuthenticated

	// We accept consent manager on the user's behalf. As per Legal & Compliance,
	// signing-in means a user is accepting our privacy policy and so we can
	// enable tracking. Should only be ran if not already set & loaded.
	useEffect(() => {
		if (isAuthenticated && !loadPreferences()) {
			saveAndLoadAnalytics()
		}
	}, [isAuthenticated])

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
