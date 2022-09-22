import { signOut, SignOutParams } from 'next-auth/react'

// global state to dedupe multiple signOut requests
let isCalling = false

/**
 * A minimal wrapper around next-auth/react's `signOut` function. Purpose is to
 * handle invoking the wrapped function with a default value.
 *
 * https://next-auth.js.org/getting-started/client#signout
 */
const signOutWrapper = async (options: SignOutParams = {}) => {
	const { callbackUrl = '/', redirect = true, ...restOptions } = options

	if (isCalling) {
		return
	}
	try {
		isCalling = true
		await signOut({ callbackUrl, redirect, ...restOptions })
	} finally {
		isCalling = false
	}
}

export { signOutWrapper }
