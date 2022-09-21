import NextAuth from 'next-auth'
import CloudIdpProvider from 'lib/auth/cloud-idp-provider'
// import refreshAccessToken from 'lib/auth/refresh-token-set'

export default NextAuth({
	session: {
		maxAge: __config.dev_dot.auth.session_max_age,
	},
	providers: [CloudIdpProvider],
	callbacks: {
		/**
		 * This callback is called whenever a JSON Web Token is created (i.e. at sign in) or updated (i.e whenever a session is accessed in the client).
		 *
		 * ref: https://next-auth.js.org/configuration/callbacks#jwt-callback
		 */
		async jwt({ token, user, account, profile }) {
			if (user && account) {
				token['https://auth.hashicorp.com/auth0/connection/id'] =
					user['https://auth.hashicorp.com/auth0/connection/id']

				token.cloud_idp_access_token = account.access_token
				token.picture = profile.picture as string
				token.nickname = profile.nickname

				token.exp = user.exp
			}

			if (Date.now() / 1000 < token.exp) {
				return token
			}

			// TODO: validate that the refresh token flow works as implemented
			// return refreshAccessToken(token)
			return { ...token, error: 'RefreshTokenError' }
		},
		/**
		 * The session callback is called whenever a session is checked. By default, only a subset of the token is returned for increased security.
		 *
		 * ref: https://next-auth.js.org/configuration/callbacks#session-callback
		 */
		async session({ session, token }) {
			return {
				...session,
				accessToken: token.cloud_idp_access_token,
				id: token.sub,
				user: { ...session.user, nickname: token.nickname },
			}
		},
	},
})
