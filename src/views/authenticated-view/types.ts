import { ReactNode } from 'react'

interface AuthenticatedViewProps {
	/**
	 * The content that should only be rendered if a user is authenticated.
	 */
	children: ReactNode

	/**
	 * The page a user should be redirected to if they are not authenticated.
	 */
	redirectTo?: string
}

export type { AuthenticatedViewProps }
