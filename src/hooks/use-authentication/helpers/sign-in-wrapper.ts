import { signIn, SignInOptions } from 'next-auth/react'
import { ValidAuthProviderId } from 'types/auth'
import { DEFAULT_PROVIDER_ID } from '..'

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
	const { redirect = true, ...restOptions } = options

	return signIn(provider, { redirect, ...restOptions })
}

export { signInWrapper }
