import providers from 'lib/auth/providers'
import { useSession, signIn, signOut, SignOutParams } from 'next-auth/react'
import { SessionData, UserData, ValidAuthProviderId } from 'types/auth'

const DEFAULT_PROVIDER_ID = ValidAuthProviderId.CloudIdp
const AUTH_ENABLED = __config.flags.enable_auth

/**
 * Creates a minimal wrapper around next-auth/react's `signIn` function. Purpose
 * is to handle invoking the wrapped function with a default value that can be
 * overwritten.
 *
 * https://next-auth.js.org/getting-started/client#signin
 */
const makeSignInWrapper = (providerId: ValidAuthProviderId) => {
	return () => signIn(providerId)
}

/**
 * A minimal wrapper around next-auth/react's `signOut` function. Purpose is to
 * handle invoking the wrapped function with a default value.
 *
 * https://next-auth.js.org/getting-started/client#signout
 */
const signOutWrapper = (options: SignOutParams = {}) => {
	const { callbackUrl = '/', redirect = true } = options
	return signOut({ callbackUrl, redirect })
}

interface UseAuthenticationOptions {
	/**
	 * Optional boolean. If true, `onUnauthenticated` is invoked if the user is
	 * not been authenticated.
	 */
	isRequired?: boolean

	/**
	 * Optional callback function. Invoked by next-auth when `isRequired` is true.
	 * By default, we invoke `signInWrapper` with no parameters.
	 */
	onUnauthenticated?: () => void

	/**
	 * Optional providerId to set as the current auth provider. Used to configure
	 * exposed callback functions and return a currentProvider object. When
	 * omitted, a default ID is used.
	 */
	providerId?: ValidAuthProviderId
}

/**
 * Hook for consuming user, session, and authentication state. Sources all data
 * from next-auth/react's `useSession` hook.
 *
 * https://next-auth.js.org/getting-started/client#usesession
 */
const useAuthentication = (options: UseAuthenticationOptions = {}) => {
	// Get `providerId` from `options` parameter, use the default if not given
	const { providerId = DEFAULT_PROVIDER_ID } = options

	// Set `currentProvider` based on the obtained `providerId`
	const currentProvider = providers[DEFAULT_PROVIDER_ID]

	// Create the `signInWrapper` using the obtained `providerId`
	const signInWrapper = makeSignInWrapper(providerId)

	// Get other option properties from `options` parameter
	const { isRequired = false, onUnauthenticated = () => signInWrapper() } =
		options

	// Pull data and status from next-auth's hook, and pass options
	const { data, status } = useSession({
		required: AUTH_ENABLED && isRequired,
		onUnauthenticated,
	})

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
		currentProvider,
		isAuthEnabled: AUTH_ENABLED,
		isAuthenticated,
		isLoading,
		session,
		signIn: signInWrapper,
		signOut: signOutWrapper,
		status,
		user,
	}
}

export default useAuthentication
