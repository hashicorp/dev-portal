/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/router'
import {
	signIn,
	SignInOptions,
	signOut,
	SignOutParams,
	useSession,
} from 'next-auth/react'
import { Session } from 'next-auth'
import { AuthErrors, ValidAuthProviderId } from 'types/auth'
import { makeSignIn, makeSignOut, signUp } from './helpers'
import { canAnalyzeUser, safeGetSegmentId } from 'lib/analytics'
import posthog from 'posthog-js'

export const DEFAULT_PROVIDER_ID = ValidAuthProviderId.CloudIdp

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
	session?: Omit<Session, 'user'>
	signIn: (
		provider?: ValidAuthProviderId,
		options?: SignInOptions
	) => ReturnType<typeof signIn>
	signOut: (options?: SignOutParams) => ReturnType<typeof signOut>
	signUp: typeof signUp
	user: null | Session['user']
	update: (data?: $TSFixMe) => Promise<Session | null>
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

	// Get option properties from `options` parameter
	const { isRequired = false, onUnauthenticated = () => signIn() } = options

	// Pass options to `useSession` hook and use values
	const { data, status, update } = useSession({
		required: isRequired,
		onUnauthenticated,
	})

	// Deriving booleans about auth state
	const isLoading = status === 'loading'
	const isAuthenticated =
		status === 'authenticated' &&
		data?.error !== AuthErrors.RefreshAccessTokenError // if we are in an errored state, treat as unauthenticated

	/**
	 * Force sign out to hopefully resolve the error. The user is signed out
	 * to prevent unwanted looping of requesting an expired refresh token
	 *
	 * https://next-auth.js.org/tutorials/refresh-token-rotation#client-side
	 */
	useEffect(() => {
		if (data?.error === AuthErrors.RefreshAccessTokenError) {
			signOut()
		}
	}, [data?.error, signOut])

	// Separating user and session data
	let session: Session, user: Session['user']
	if (isAuthenticated) {
		session = { ...data }
		user = data.user
		delete session.user

		const segmentUserId = safeGetSegmentId()

		if (canAnalyzeUser() && segmentUserId !== session.id) {
			window.analytics?.identify(session.id, {
				email: user.email,
				devPortalSignUp: true,
			})
		}
	}
	// track authenticated user
	useEffect(() => {
		const userId = data?.user?.id
		if (!isAuthenticated || !userId || !posthog) return

		posthog.identify(data.user?.id)
	}, [data?.user?.id, isAuthenticated])

	// Return everything packaged up in an object
	return {
		isAuthenticated,
		isLoading,
		session,
		update,
		signIn,
		signOut,
		signUp,
		user,
	}
}

export default useAuthentication
