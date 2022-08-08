import {
	signIn,
	SignInOptions,
	signOut,
	SignOutParams,
	useSession,
} from 'next-auth/react'
import { SessionData, UserData, ValidAuthProviderId } from 'types/auth'

const AUTH_ENABLED = __config.flags.enable_auth
const DEFAULT_PROVIDER_ID = ValidAuthProviderId.CloudIdp
const DEFAULT_SIGN_IN_CALLBACK_URL = '/profile'

/**
 * A minimal wrapper around next-auth/react's `signIn` function. Purpose is to
 * handle invoking the wrapped function with a default value.
 *
 * https://next-auth.js.org/getting-started/client#signin
 */
const signInWrapper = (
	provider: ValidAuthProviderId = DEFAULT_PROVIDER_ID,
	options: SignInOptions = {}
) => {
	const {
		callbackUrl = DEFAULT_SIGN_IN_CALLBACK_URL,
		redirect = true,
		...restOptions
	} = options

	return signIn(provider, { callbackUrl, redirect, ...restOptions })
}

/**
 * A minimal wrapper around next-auth/react's `signOut` function. Purpose is to
 * handle invoking the wrapped function with a default value.
 *
 * https://next-auth.js.org/getting-started/client#signout
 */
const signOutWrapper = (options: SignOutParams = {}) => {
	const { callbackUrl = '/', redirect = true, ...restOptions } = options

	return signOut({ callbackUrl, redirect, ...restOptions })
}

interface SignUpAuthParams extends Record<string, string> {
	screen_hint?: string
}

/**
 * A function for invoking the sign up flow for an auth provider.
 */
const signUp = (
	provider: ValidAuthProviderId = DEFAULT_PROVIDER_ID,
	options: SignInOptions = {},
	authParams: SignUpAuthParams = {}
) => {
	const { callbackUrl = DEFAULT_SIGN_IN_CALLBACK_URL, ...restOptions } = options
	const { screen_hint = 'signup', ...restParams } = authParams

	return signIn(
		provider,
		{ callbackUrl, ...restOptions },
		{ screen_hint, ...restParams }
	)
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
}

/**
 * Hook for consuming user, session, and authentication state. Sources all data
 * from next-auth/react's `useSession` hook.
 *
 * https://next-auth.js.org/getting-started/client#usesession
 */
const useAuthentication = (options: UseAuthenticationOptions = {}) => {
	// Get option properties from `options` parameter
	const { isRequired = false, onUnauthenticated = () => signInWrapper() } =
		options

	// Pull data and status from next-auth's hook, and pass options
	const { data, status } = useSession({
		required: AUTH_ENABLED && isRequired,
		onUnauthenticated,
	})

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
