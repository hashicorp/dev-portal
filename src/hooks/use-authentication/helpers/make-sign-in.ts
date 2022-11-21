import { signIn, SignInOptions as _SignInOptions } from 'next-auth/react'
import { ValidAuthProviderId } from 'types/auth'
import { DEFAULT_PROVIDER_ID } from '..'

type SignInOptions = Pick<_SignInOptions, 'callbackUrl' | 'redirect'>

/**
 * Creates a minimal wrapper around next-auth/react's `signIn` function. Its
 * purpose is to handle invoking the wrapped function with default values.
 *
 * Note:  The sign in method reroutes back to the original url by default
 *
 * https://next-auth.js.org/getting-started/client#signin
 */
const makeSignIn = () => {
	return (
		provider: ValidAuthProviderId = DEFAULT_PROVIDER_ID,
		options: SignInOptions = {}
	) => {
		const { redirect = true } = options

		return signIn(provider, { redirect })
	}
}

export { makeSignIn }
