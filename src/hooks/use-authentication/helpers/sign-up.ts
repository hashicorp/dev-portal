import { signIn, SignInOptions } from 'next-auth/react'
import { ValidAuthProviderId } from 'types/auth'
import { DEFAULT_PROVIDER_ID } from '../'

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
	const { screen_hint = 'signup', ...restParams } = authParams

	return signIn(provider, options, { screen_hint, ...restParams })
}

export { signUp }
