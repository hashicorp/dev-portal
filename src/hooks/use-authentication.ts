import { useSession, signIn, signOut } from 'next-auth/react'
import { SessionData, UserData, ValidAuthProviderId } from 'types/auth'

/**
 * A minimal wrapper around next-auth/react's `signIn` function. Purpose is to
 * handle invoking the wrapped function with a default value.
 */
const signInWrapper = (
	provider: ValidAuthProviderId = ValidAuthProviderId.CloudIdp
) => {
	return signIn(provider)
}

/**
 * Hook for consuming user, session, and authentication state. Sources all data
 * from next-auth/react's `useSession` hook.
 */
const useAuthentication = () => {
	// Pull data and status from next-auth's hook
	const { data, status } = useSession()

	// Deriving booleans about auth state
	const isLoading = status === 'loading'
	const isAuthenticated = status === 'authenticated'

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
		signIn: signInWrapper,
		signOut,
		status,
		user,
	}
}

export default useAuthentication
