/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { signIn, SignInOptions, signOut, SignOutParams } from 'next-auth/react'
import { Session } from 'next-auth'
import { SessionStatus, ValidAuthProviderId } from 'types/auth'

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
	session?: Omit<Session, 'user'>
	signIn: (
		provider?: ValidAuthProviderId,
		options?: SignInOptions
	) => ReturnType<typeof signIn>
	signOut: (options?: SignOutParams) => ReturnType<typeof signOut>
	signUp: typeof signUp
	user: null | Session['user']
}

export type { UseAuthenticationOptions, UseAuthenticationResult, SessionStatus }
