import NextAuth, { DefaultSession } from 'next-auth'

declare module 'next-auth' {
	/**
	 * Object representing an authentication session.
	 *
	 * Returned by `useSession`, `getSession` and received as a prop on
	 * the `SessionProvider` React Context
	 */
	interface Session {
		accessToken?: string
		id?: string
		error?: AuthErrors

		user: {
			/** The user's postal address. */
			nickname: string
		} & DefaultSession['user']
	}
}
