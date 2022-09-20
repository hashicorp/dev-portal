import { signOut, SignOutParams } from 'next-auth/react'

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

export { signOutWrapper }
