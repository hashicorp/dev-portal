import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { saveAndLoadAnalytics } from '@hashicorp/react-consent-manager'
import { preferencesSavedAndLoaded } from '@hashicorp/react-consent-manager/util/cookies'
import {
	AuthErrors,
	SessionData,
	UserData,
	ValidAuthProviderId,
} from 'types/auth'
import { UseAuthenticationOptions, UseAuthenticationResult } from './types'
import { makeSignIn, makeSignOut, signUp } from './helpers'

export const DEFAULT_PROVIDER_ID = ValidAuthProviderId.CloudIdp

function useAuthMethods() {
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

	return { signIn, signOut }
}

export function useAuthenticationToken() {
	const [token, setToken] = useState(null)

	const { data, status } = useSession()

	useEffect(() => {
		if (status !== 'authenticated') {
			return
		}

		const sessionToken = data?.accessToken
		// if the token isn't set but exists in sesion or the token is
		// set but doesn't match what is in the session, set the token
		if (
			(!token && sessionToken) ||
			(token && sessionToken && token !== sessionToken)
		) {
			setToken(token)
		}
	}, [data, token, status])

	return token
}

/**
 * Hook for consuming user, session, and authentication state. Sources all data
 * from next-auth/react's `useSession` hook.
 *
 * https://next-auth.js.org/getting-started/client#usesession
 */
const useAuthentication = (
	options: UseAuthenticationOptions = {}
): UseAuthenticationResult => {
	const { signIn, signOut } = useAuthMethods()

	// Pull data and status from next-auth's hook, and pass options
	const { data, status } = useSession({
		required: options.isRequired,
		onUnauthenticated: options.onUnauthenticated,
	})
	const [isAuthenticated, setIsAuthenticated] = useState(false)

	// retain authenticated state based on status
	useEffect(() => {
		if (!isAuthenticated && status === 'authenticated') {
			setIsAuthenticated(true)
		} else if (isAuthenticated && status === 'unauthenticated') {
			setIsAuthenticated(false)
		}
	}, [status, isAuthenticated])

	/**
	 * If the token exchange has an error, Force sign out to hopefully resolve
	 * https://next-auth.js.org/tutorials/refresh-token-rotation#client-side
	 */
	useEffect(() => {
		if (
			data?.error === AuthErrors.RefreshAccessTokenExpiredError ||
			data?.error === AuthErrors.RefreshAccessTokenInvalidGrantError
		) {
			setIsAuthenticated(false)
			signOut()
		}
	}, [data?.error, signOut])

	// Deriving booleans about auth state
	const isLoading = status === 'loading'
	const preferencesLoaded = preferencesSavedAndLoaded()
	const error = data?.error

	// We accept consent manager on the user's behalf. As per Legal & Compliance,
	// signing-in means a user is accepting our privacy policy and so we can
	// enable tracking. Should only be ran if not already set & loaded.
	useEffect(() => {
		if (isAuthenticated && !preferencesLoaded) {
			saveAndLoadAnalytics({ loadAll: true })
		}
	}, [isAuthenticated, preferencesLoaded])

	// Return everything packaged up in an object
	return {
		error,
		isAuthenticated,
		isLoading,
		signIn,
		signOut,
		signUp,
		user: data?.user ?? null,
	}
}

export default useAuthentication
