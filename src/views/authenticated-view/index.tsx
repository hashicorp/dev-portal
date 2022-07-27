import useAuthentication from 'hooks/use-authentication'
import ErrorView from 'views/error-view-switcher'
import { AuthenticatedViewProps } from './types'

/**
 * A view that handles gating content behind authentication. Also handles
 * redirecting the user to the specified `redirectTo` page if they are not
 * authenticated.
 */
const AuthenticatedView = ({ children }: AuthenticatedViewProps) => {
	const { isAuthenticated, isAuthEnabled } = useAuthentication({
		isRequired: true,
	})

	// Show the 404 error view if auth is not enabled
	if (!isAuthEnabled) {
		return <ErrorView statusCode={404} isProxiedDotIo={false} />
	}

	// TODO - add a loading indicator?
	if (!isAuthenticated) {
		return null
	}

	return <>{children}</>
}

export default AuthenticatedView
