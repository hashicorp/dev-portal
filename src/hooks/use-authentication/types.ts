import { signIn, SignInOptions, signOut, SignOutParams } from 'next-auth/react'
import { Session } from 'next-auth'
import { SessionStatus, ValidAuthProviderId } from 'types/auth'

import { signUp } from './helpers'

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

export type { UseAuthenticationResult, SessionStatus }
