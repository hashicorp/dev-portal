/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { NextRouter } from 'next/router'
import { signOut, SignOutParams } from 'next-auth/react'

interface MakeSignOutOptions {
	routerPath: NextRouter['asPath']
}

type SignOutOptions = Pick<SignOutParams, 'callbackUrl' | 'redirect'>

/**
 * A minimal wrapper around next-auth/react's `signOut` function. Purpose is to
 * handle invoking the wrapped function with a default value.
 *
 * https://next-auth.js.org/getting-started/client#signout
 */
const makeSignOut = ({ routerPath }: MakeSignOutOptions) => {
	return (options: SignOutOptions = {}) => {
		const {
			callbackUrl = routerPath === '/profile/bookmarks' ? '/' : routerPath,
			redirect = true,
		} = options
		return signOut({ callbackUrl, redirect })
	}
}

export { makeSignOut }
