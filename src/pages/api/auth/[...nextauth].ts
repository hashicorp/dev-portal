import NextAuth from 'next-auth'
import { URLSearchParams } from 'url'

async function refreshAccessToken(token) {
	try {
		const url =
			__config.dev_dot.auth.idp_url +
			'/oauth2/token?' +
			new URLSearchParams({
				client_id: process.env.AUTH_CLIENT_ID,
				client_secret: process.env.AUTH_CLIENT_SECRET,
				grant_type: 'refresh_token',
				refresh_token: token.refreshToken,
			})

		const response = await fetch(url, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			method: 'POST',
		})

		const refreshedTokens = await response.json()

		if (!response.ok) {
			throw refreshedTokens
		}

		return {
			...token,
			accessToken: refreshedTokens.access_token,
			accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
			refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
		}
	} catch (error) {
		console.log(error)

		return {
			...token,
			error: 'RefreshAccessTokenError',
		}
	}
}

export default NextAuth({
	session: {
		maxAge: 3600,
	},
	providers: [
		{
			id: 'cloud-idp',
			name: 'Cloud IDP',
			type: 'oauth',
			wellKnown:
				__config.dev_dot.auth.idp_url + '/.well-known/openid-configuration',
			authorization: { params: { scope: 'openid' } },
			idToken: true,
			checks: ['pkce', 'state'],
			clientId: process.env.AUTH_CLIENT_ID,
			clientSecret: process.env.AUTH_CLIENT_SECRET,
			client: {
				name: 'HashiCorp Developer',
				response_types: ['RESPONSE_TYPE_CODE', 'RESPONSE_TYPE_TOKEN'],
				token_endpoint_auth_method: 'client_secret_post',
			},
			profile(profile) {
				return { id: profile.sub, ...profile }
			},
		},
	],
	callbacks: {
		async jwt({ token, user, account, profile, isNewUser }) {
			if (user && account) {
				token['https://auth.hashicorp.com/auth0/connection/id'] =
					user['https://auth.hashicorp.com/auth0/connection/id']

				token.cloud_idp_access_token = account.access_token
				token.picture = profile.picture as string

				token.exp = user.exp
			}

			if (Date.now() / 1000 < (token as { exp: number }).exp) {
				return token
			}

			// return refreshAccessToken(token);
			return { ...token, error: 'RefreshTokenError' }
		},
		async session({ session, token, user }) {
			return session
		},
	},
})
