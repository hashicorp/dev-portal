/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import useAuthentication from 'hooks/use-authentication'
import { AuthenticatedViewProps } from './types'

/**
 * A view that handles gating content behind authentication. Also handles
 * redirecting the user to the specified `redirectTo` page if they are not
 * authenticated.
 */
const AuthenticatedView = ({ children }: AuthenticatedViewProps) => {
	const { isAuthenticated } = useAuthentication({
		isRequired: true,
	})

	// TODO - add a loading indicator
	if (!isAuthenticated) {
		return null
	}

	return <>{children}</>
}

export default AuthenticatedView
