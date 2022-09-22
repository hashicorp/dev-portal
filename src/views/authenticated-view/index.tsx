import useAuthentication from 'hooks/use-authentication'
import { AuthErrors } from 'types/auth'
// import { signOut } from 'next-auth/react'
import ErrorView from 'views/error-view-switcher'
import { AuthenticatedViewProps } from './types'
// import { signIn, SignInOptions } from 'next-auth/react'

/**
 * A view that handles gating content behind authentication. Also handles
 * redirecting the user to the specified `redirectTo` page if they are not
 * authenticated.
 */
const AuthenticatedView = ({ children }: AuthenticatedViewProps) => {
	const { isAuthenticated, isAuthEnabled, session, signOut } =
		useAuthentication({
			isRequired: true,
		})

	if (session?.error === AuthErrors.RefreshAccessTokenError) {
		signOut()
		return null
	}

	// Show the 404 error view if auth is not enabled
	if (!isAuthEnabled) {
		return <ErrorView statusCode={404} isProxiedDotIo={false} />
	}

	// TODO - add a loading indicator?
	if (!isAuthenticated) {
		return null
	}

	return (
		<div>
			<h1>test</h1>
			{children}
		</div>
	)
}

export default AuthenticatedView
