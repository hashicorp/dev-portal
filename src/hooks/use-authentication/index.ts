import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import { Session } from 'next-auth'
import { saveAndLoadAnalytics } from '@hashicorp/react-consent-manager'
import { preferencesSavedAndLoaded } from '@hashicorp/react-consent-manager/util/cookies'
import { AuthErrors, ValidAuthProviderId } from 'types/auth'
import { useSession } from 'lib/auth/use-session'
import { UseAuthenticationResult } from './types'
import { makeSignIn, makeSignOut, signUp } from './helpers'

export const DEFAULT_PROVIDER_ID = ValidAuthProviderId.CloudIdp

/**
 * Hook for consuming user, session, and authentication state. Sources all data
 * from next-auth/react's `useSession` hook.
 *
 * https://next-auth.js.org/getting-started/client#usesession
 */
const useAuthentication = (): UseAuthenticationResult => {
	// Get router path for `signIn` and `signOut` `callbackUrl`s
	const router = useRouter()

	// Set up memoized `signIn` and `signOut` callbacks
	const signIn = useMemo(
		() => makeSignIn({ routerPath: router.asPath }),
		[router.asPath]
	)
	const signOut = useMemo(
		() => makeSignOut({ routerPath: router.asPath }),
		[router.asPath]
	)

	const { data, status } = useSession()

	// Deriving booleans about auth state
	const isLoading = status === 'loading'
	const isAuthenticated =
		status === 'authenticated' &&
		data?.error !== AuthErrors.RefreshAccessTokenError // if we are in an errored state, treat as unauthenticated
	const preferencesLoaded = preferencesSavedAndLoaded()

	/**
	 * Force sign out to hopefully resolve the error. The user is signed out
	 * to prevent unwanted looping of requesting an expired refresh token
	 *
	 * https://next-auth.js.org/tutorials/refresh-token-rotation#client-side
	 */
	// useEffect(() => {
	// 	if (data?.error === AuthErrors.RefreshAccessTokenError) {
	// 		signOut()
	// 	}
	// }, [data?.error, signOut])

	// We accept consent manager on the user's behalf. As per Legal & Compliance,
	// signing-in means a user is accepting our privacy policy and so we can
	// enable tracking. Should only be ran if not already set & loaded.
	useEffect(() => {
		if (isAuthenticated && !preferencesLoaded) {
			saveAndLoadAnalytics({ loadAll: true })
		}
	}, [isAuthenticated, preferencesLoaded])

	// Separating user and session data
	let session: Session, user: Session['user']
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
		signIn,
		signOut,
		signUp,
		user,
	}
}

export default useAuthentication
