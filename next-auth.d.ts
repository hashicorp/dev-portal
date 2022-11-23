import { DefaultSession } from 'next-auth'
import { AuthErrors } from 'types/auth'

declare module 'next-auth' {
	/**
	 * Object representing an authentication session.
	 *
	 * Returned by `useSession`, `getSession` and received as a prop on
	 * the `SessionProvider` React Context.
	 */
	interface Session {
		accessToken?: string
		id?: string
		error?: AuthErrors
		/**
		 * Object representing an authenticated user.
		 */
		user: {
			/** The user's nickname. */
			nickname?: string | null
		} & DefaultSession['user']
	}
}

declare module 'next-auth/jwt' {
	/** Returned by the `jwt` callback  */
	interface JWT {
		access_token: string
		refresh_token: string
		scope: string
		expires_in: number
		id_token: string
		token_type: 'bearer'
		error?: AuthErrors
		nickname?: string
		picture?: string
	}
}
