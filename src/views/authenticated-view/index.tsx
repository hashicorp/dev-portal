import { useEffect } from 'react'
import { useRouter } from 'next/router'
import useAuthentication from 'hooks/use-authentication'
import { AuthenticatedViewProps } from './types'

/**
 * A view that handles gating content behind authentication. Also handles
 * redirecting the user to the specified `redirectTo` page if they are not
 * authenticated.
 */
const AuthenticatedView = ({
	children,
	redirectTo = '/auth',
}: AuthenticatedViewProps) => {
	const router = useRouter()
	const { isLoading, isAuthenticated, user } = useAuthentication()

	// Redirect to the specified page if not authenticated
	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			router.push(redirectTo)
		}
	}, [isAuthenticated, isLoading, redirectTo, router])

	// Show loading message while data is loading
	if (!user) {
		return <p>Loading...</p>
	}

	// Render gated content after loading authentication data
	return <>{children}</>
}

export default AuthenticatedView
