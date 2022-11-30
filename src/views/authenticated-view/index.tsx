import useAuthentication from 'hooks/use-authentication'
import { useRequiredAuthentication } from 'lib/auth/use-session'
import { AuthenticatedViewProps } from './types'

/**
 * A view that handles gating content behind authentication. Also handles
 * redirecting the user to the specified `redirectTo` page if they are not
 * authenticated.
 */
const AuthenticatedView = ({ children }: AuthenticatedViewProps) => {
	const { isAuthenticated, signIn } = useAuthentication()
	useRequiredAuthentication({ onUnauthenticated: signIn })

	// TODO - add a loading indicator
	if (!isAuthenticated) {
		return null
	}

	return <>{children}</>
}

export default AuthenticatedView
