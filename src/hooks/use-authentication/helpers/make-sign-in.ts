/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { NextRouter } from 'next/router'
import { signIn, SignInOptions as _SignInOptions } from 'next-auth/react'
import { ValidAuthProviderId } from 'types/auth'
import { DEFAULT_PROVIDER_ID } from '..'
import posthog from 'posthog-js'

interface MakeSignInOptions {
	routerPath: NextRouter['asPath']
}

type SignInOptions = Pick<_SignInOptions, 'callbackUrl' | 'redirect'>

/**
 * Creates a minimal wrapper around next-auth/react's `signIn` function. Its
 * purpose is to handle invoking the wrapped function with default values.
 *
 * https://next-auth.js.org/getting-started/client#signin
 */
const makeSignIn = ({ routerPath }: MakeSignInOptions) => {
	return (
		provider: ValidAuthProviderId = DEFAULT_PROVIDER_ID,
		options: SignInOptions = {}
	) => {
		const { callbackUrl = routerPath, redirect = true } = options

		posthog.capture('user_authenticated', {
			source: 'sign_in',
			trigger: 'manual_sign_in',
			timestamp: new Date().toISOString(),
		})

		return signIn(provider, { callbackUrl, redirect })
	}
}

export { makeSignIn }
