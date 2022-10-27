import createFetch from '@vercel/fetch'
import NextAuth from 'next-auth'
import CloudIdpProvider from 'lib/auth/cloud-idp-provider'
import refreshTokenSet from 'lib/auth/refresh-token-set'
import isJwtExpired from 'lib/auth/is-jwt-expired'
import { AuthErrors } from 'types/auth'

const fetch = createFetch()

const isDev = process.env.NODE_ENV === 'development'

export default NextAuth({
	session: {
		maxAge: 2592000, // 30 days
	},
	// https://next-auth.js.org/configuration/options#events
	events: {
		/**
		 * NOTE: NextAuth does not log out of auth providers, so we have to handle doing that
		 * ourselves in this signOut event.
		 * https://github.com/nextauthjs/next-auth/discussions/3938
		 */
		async signOut({ token }) {
			try {
				const wellKnownConfiguration = await (
					await fetch(CloudIdpProvider.wellKnown)
				).json()
				const endSessionEndpoint = wellKnownConfiguration.end_session_endpoint
				await fetch(`${endSessionEndpoint}?id_token_hint=${token.id_token}`)
			} catch (e) {
				console.error(
					'[NextAuth] There was an error in the `signOut` event:',
					e
				)
			}
		},
	},
	providers: [CloudIdpProvider],
	callbacks: {
		/**
		 * This callback is called whenever a JSON Web Token is created (i.e. at sign in) or updated (i.e whenever a session is accessed in the client).
		 *
		 * ref: https://next-auth.js.org/configuration/callbacks#jwt-callback
		 */
		async jwt({ token, account, profile }) {
			const isInitial = !!account && !!profile
			isDev &&
				console.log('jwt callback (%s)', isInitial ? 'initial' : 'subsequent')

			// initial call during sign in
			if (isInitial) {
				// persist access_token, refresh_token, and id_token on the session token
				// id_token is needed for the signOut event above
				token.access_token = account.access_token
				token.refresh_token = account.refresh_token
				token.id_token = account.id_token

				// Picture is passed to session.user.image
				token.picture = profile.picture as string
				token.nickname = profile.nickname

				return token
			}

			// subsequent calls when session is accessed
			const [isAccessTokenExpired, secondsUntilExpiry] = isJwtExpired(
				token.access_token as string
			)

			if (isAccessTokenExpired) {
				// Refresh token set w/ refreshToken
				try {
					isDev && console.log('access token has expired; refreshing...')
					const { access_token, refresh_token } = await refreshTokenSet(
						token.refresh_token as string
					)
					isDev && console.log('successfully refreshed token set')

					token.access_token = access_token
					token.refresh_token = refresh_token
				} catch (err) {
					console.error('failed to refresh token set', err)
					return { ...token, error: AuthErrors.RefreshAccessTokenError }
				}
			} else {
				// Noop; log time until expiry
				isDev &&
					console.log(
						'access token still valid for %d seconds',
						secondsUntilExpiry
					)
			}

			return token
		},
		/**
		 * The session callback is called whenever a session is checked. By default, only a subset of the token is returned for increased security.
		 *
		 * ref: https://next-auth.js.org/configuration/callbacks#session-callback
		 */
		async session({ session, token }) {
			return {
				...session,
				accessToken: token.access_token,
				id: token.sub,
				user: { ...session.user, nickname: token.nickname },
				error: token.error,
			}
		},
	},
})
