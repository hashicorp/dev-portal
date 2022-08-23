import { signIn, SignInOptions } from 'next-auth/react'
import { ValidAuthProviderId } from 'types/auth'
import { DEFAULT_PROVIDER_ID, DEFAULT_SIGN_IN_CALLBACK_URL } from '..'

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

export { signInWrapper }
