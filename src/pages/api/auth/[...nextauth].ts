import createFetch from '@vercel/fetch'
import NextAuth from 'next-auth'
import { URL } from 'url'
import { AuthErrors, TokenSet } from 'types/auth'
import CloudIdpProvider from 'lib/auth/cloud-idp-provider'
import refreshTokenSet from 'lib/auth/refresh-token-set'
import isJwtExpired from 'lib/auth/is-jwt-expired'

const fetch = createFetch()

const isDev = process.env.NODE_ENV === 'development'

export default NextAuth({
	session: {
		maxAge: 2592000, // 30 days
	},
	// https://next-auth.js.org/configuration/options#events
	events: {
		async signIn(message) {
			// console.log('sign in callback')
			// console.log({ message })
			// example message
			// {
			//   message: {
			//     user: {
			//       id: '6c9199fc-a6ff-4402-9241-e5516f2037c8',
			//       at_hash: '-a0FY1bz4thdVWbR6zxDIA',
			//       aud: [Array],
			//       auth_time: 1668455007,
			//       email: 'testnewsignup@test.com',
			//       email_verified: false,
			//       exp: 1668458615,
			//       'https://auth.hashicorp.com/auth0/connection/id': 'con_XqZH31xVqDQyudOd',
			//       'https://auth.hashicorp.com/auth0/connection/name': 'Username-Password-Authentication',
			//       'https://auth.hashicorp.com/auth0/connection/strategy': 'auth0',
			//       'https://auth.hashicorp.com/connection': 'auth0',
			//       'https://auth.hashicorp.com/connection/id': 'con_XqZH31xVqDQyudOd',
			//       'https://auth.hashicorp.com/connection/name': 'Username-Password-Authentication',
			//       'https://auth.hashicorp.com/connection/strategy': 'auth0',
			//       'https://auth.hashicorp.com/idp': 'auth0',
			//       'https://auth.hashicorp.com/mfa_enabled': false,
			//       'https://auth.hashicorp.com/primary-identity-provider': 'auth0',
			//       'https://auth.hashicorp.com/sub': 'auth0|63729a5dd46f37e2ed8d5f73',
			//       iat: 1668455015,
			//       iss: 'https://auth.idp.hcp.dev/',
			//       jti: 'c435206f-841b-4675-a289-ae2cdad2908d',
			//       name: 'testnewsignup@test.com',
			//       nickname: 'testnewsignup',
			//       picture: 'https://s.gravatar.com/avatar/9cfdeb0406d3c60b2f470a01829a80a5?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fte.png',
			//       rat: 1668454988,
			//       sid: '3d3eaf50-bb35-44f7-a1b9-cde29b09790d',
			//       sub: '6c9199fc-a6ff-4402-9241-e5516f2037c8',
			//       updated_at: '2022-11-14T19:43:25.305Z'
			//     },
			//     account: {
			//       provider: 'cloud-idp',
			//       type: 'oauth',
			//       providerAccountId: '6c9199fc-a6ff-4402-9241-e5516f2037c8',
			//       access_token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6InB1YmxpYzpkYmVmNzZhMS04YzVhLTRiMzYtYWQ4Mi0zNDBmMTJmNDJkNWEiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwiaHR0cHM6Ly95Y21zdzN5ZzRhLnVzLWVhc3QtMS5hd3NhcHBydW5uZXIuY29tIiwiaHR0cHM6Ly9waWRyOHJ6bXdwLnVzLWVhc3QtMS5hd3NhcHBydW5uZXIuY29tIiwiaHR0cDovL2xvY2FsaG9zdDo1MDAwIl0sImNsaWVudF9pZCI6IjY4ODBiN2ZiLTkyOWQtNDkxMi1iYjMyLTEzNjM1ODkwMjBmYSIsImV4cCI6MTY2ODQ1ODYxNSwiZXh0Ijp7Imh0dHBzOi8vYXV0aC5oYXNoaWNvcnAuY29tL2F1dGgwL2Nvbm5lY3Rpb24vaWQiOiJjb25fWHFaSDMxeFZxRFF5dWRPZCIsImh0dHBzOi8vYXV0aC5oYXNoaWNvcnAuY29tL2F1dGgwL2Nvbm5lY3Rpb24vbmFtZSI6IlVzZXJuYW1lLVBhc3N3b3JkLUF1dGhlbnRpY2F0aW9uIiwiaHR0cHM6Ly9hdXRoLmhhc2hpY29ycC5jb20vYXV0aDAvY29ubmVjdGlvbi9zdHJhdGVneSI6ImF1dGgwIiwiaHR0cHM6Ly9hdXRoLmhhc2hpY29ycC5jb20vaWRwIjoiYXV0aDAiLCJodHRwczovL2F1dGguaGFzaGljb3JwLmNvbS9zdWIiOiJhdXRoMHw2MzcyOWE1ZGQ0NmYzN2UyZWQ4ZDVmNzMifSwiaWF0IjoxNjY4NDU1MDE0LCJpc3MiOiJodHRwczovL2F1dGguaWRwLmhjcC5kZXYvIiwianRpIjoiYWQ1MWZiNTEtMGEyNy00MjNhLWI4ODAtMTJlZmFkNzYzNzcxIiwibmJmIjoxNjY4NDU1MDE0LCJzY3AiOlsib3BlbmlkIiwib2ZmbGluZSJdLCJzdWIiOiI2YzkxOTlmYy1hNmZmLTQ0MDItOTI0MS1lNTUxNmYyMDM3YzgifQ.FBwLlMTc7dN5dmhNQIfDci23C9AcgZPwqgJlilzD64I-FDzlWQd42q2iXfagcvHJZTAjKEq5FCuXzPFmxlboIp1BI9hGMbe2XyXtj_Zo8GWYq5-7VkEYG9hLkscCqGPv3yBZXGuhjNgUXUcD0ma1oRXGgPdYCOyzGrvZsTOXiNNYy4hbKJHFCD9CjjO3LomIF2ihzKjP_ohWmDrsybg9QY1JFTtHuYRtKBUmdIQ7Hn9JGTnml_KsKDFb0UE16lBM5odjTXrwEHyZKedWE1Cy1jk-oHx3vN6PZX4h_zORVwN3z8mmzfuh0cwojWVy0jBgG9szR07IP_-cRPPcn7NGPzDB0rKRqm2gUotqXWsMGRnjdIHFvI6jUHg2YWHwzyny9dsHEOiPGcsupLSu6IQqn4HEJNDESG35Tvd0p6CxKvBSGWDYs9id1iBMhRW0PFAwkqY7qq6Ur8kF9n6YZqqWKzxSA54qFuX3HSI6QnFWzcIKUS8A1xMOLBst6cEO33QlQPwFxFdthW2jWiPrSR71vBv59oV_PeF3nqWv-RyIxFyOIys6bmEoDUDOLFs8B93CmwPYZHnLBf0GdqcnUZ-x2O6h9uOxdZMqlKzkdjMsDZEH-Ih8eKfBUbktMc9Vf_YthIkG7APDT0-03KWRQTGDhTtCmG-d-RIeWp11OjoRh6M',
			//       expires_at: 1668458614,
			//       id_token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6InB1YmxpYzowMTE4ODI1Ni0xNmQzLTQ2OWQtOGI5OC1mY2Q2ODM2MDRlNjQiLCJ0eXAiOiJKV1QifQ.eyJhdF9oYXNoIjoiLWEwRlkxYno0dGhkVldiUjZ6eERJQSIsImF1ZCI6WyI2ODgwYjdmYi05MjlkLTQ5MTItYmIzMi0xMzYzNTg5MDIwZmEiXSwiYXV0aF90aW1lIjoxNjY4NDU1MDA3LCJlbWFpbCI6InRlc3RuZXdzaWdudXBAdGVzdC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImV4cCI6MTY2ODQ1ODYxNSwiaHR0cHM6Ly9hdXRoLmhhc2hpY29ycC5jb20vYXV0aDAvY29ubmVjdGlvbi9pZCI6ImNvbl9YcVpIMzF4VnFEUXl1ZE9kIiwiaHR0cHM6Ly9hdXRoLmhhc2hpY29ycC5jb20vYXV0aDAvY29ubmVjdGlvbi9uYW1lIjoiVXNlcm5hbWUtUGFzc3dvcmQtQXV0aGVudGljYXRpb24iLCJodHRwczovL2F1dGguaGFzaGljb3JwLmNvbS9hdXRoMC9jb25uZWN0aW9uL3N0cmF0ZWd5IjoiYXV0aDAiLCJodHRwczovL2F1dGguaGFzaGljb3JwLmNvbS9jb25uZWN0aW9uIjoiYXV0aDAiLCJodHRwczovL2F1dGguaGFzaGljb3JwLmNvbS9jb25uZWN0aW9uL2lkIjoiY29uX1hxWkgzMXhWcURReXVkT2QiLCJodHRwczovL2F1dGguaGFzaGljb3JwLmNvbS9jb25uZWN0aW9uL25hbWUiOiJVc2VybmFtZS1QYXNzd29yZC1BdXRoZW50aWNhdGlvbiIsImh0dHBzOi8vYXV0aC5oYXNoaWNvcnAuY29tL2Nvbm5lY3Rpb24vc3RyYXRlZ3kiOiJhdXRoMCIsImh0dHBzOi8vYXV0aC5oYXNoaWNvcnAuY29tL2lkcCI6ImF1dGgwIiwiaHR0cHM6Ly9hdXRoLmhhc2hpY29ycC5jb20vbWZhX2VuYWJsZWQiOmZhbHNlLCJodHRwczovL2F1dGguaGFzaGljb3JwLmNvbS9wcmltYXJ5LWlkZW50aXR5LXByb3ZpZGVyIjoiYXV0aDAiLCJodHRwczovL2F1dGguaGFzaGljb3JwLmNvbS9zdWIiOiJhdXRoMHw2MzcyOWE1ZGQ0NmYzN2UyZWQ4ZDVmNzMiLCJpYXQiOjE2Njg0NTUwMTUsImlzcyI6Imh0dHBzOi8vYXV0aC5pZHAuaGNwLmRldi8iLCJqdGkiOiJjNDM1MjA2Zi04NDFiLTQ2NzUtYTI4OS1hZTJjZGFkMjkwOGQiLCJuYW1lIjoidGVzdG5ld3NpZ251cEB0ZXN0LmNvbSIsIm5pY2tuYW1lIjoidGVzdG5ld3NpZ251cCIsInBpY3R1cmUiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci85Y2ZkZWIwNDA2ZDNjNjBiMmY0NzBhMDE4MjlhODBhNT9zPTQ4MFx1MDAyNnI9cGdcdTAwMjZkPWh0dHBzJTNBJTJGJTJGY2RuLmF1dGgwLmNvbSUyRmF2YXRhcnMlMkZ0ZS5wbmciLCJyYXQiOjE2Njg0NTQ5ODgsInNpZCI6IjNkM2VhZjUwLWJiMzUtNDRmNy1hMWI5LWNkZTI5YjA5NzkwZCIsInN1YiI6IjZjOTE5OWZjLWE2ZmYtNDQwMi05MjQxLWU1NTE2ZjIwMzdjOCIsInVwZGF0ZWRfYXQiOiIyMDIyLTExLTE0VDE5OjQzOjI1LjMwNVoifQ.Ml3dgdCO5wF1XK329Y8VvjycexrD35_PfVkpyAPyCW7y49aRQhKJ5H6Gslxha2_8pEkfGOCmfLrACyYa_uElLqmjZT5iLK5ja15MsQLNSq_ih2yT0qq7P0lvAoRF5n3WIo5EaNd7vDyhYVWX9N4F_9cbqMj_7WB9D5XTVrSOY07ZWxN5xhV7sf_aHU0MICc1k3niLYBL9Qhx8_gzLIwXK48HApen-0WExiGOkpFG2jYxgsQZ_gXvE4kIgjghZr3ABgdPDdmKZZrP21iEnbLbpVMiW8C88Q8Arg2a4Kk9dccyd-fCkok-8u6WnUTxtpDB9O9qVUFfne8O7sMx9IeBPhppTlf3yLydf-CxxmowOlB5BUdd2XBkYVheqV4F7zrF0-n10EsGG4ceQiCXBuXUbiAtijoEEO_ehj9hU0xDP-TMVfhgkHtMgzLJzMXIdgNQszjjjx8luMvc8qBv5998QhtFJ5aYdeVorlHYWPQ-Wn6htKBFJhOM9yMV4nOAdJ7S4ImfhfX01FitpDJkbxFGRFk3-0GR9vG2qc7WGWH3lS9P5oUJ1QI8j34VrWPUouJ1ccv4foW2CP2h9nVnmvEQdspv6GWgSwwp-Q6N5XisQyaf2MQuK92Tl8ewlsz-umwQkp0ZhK2ecx8ZiUgbCyFZgtEhKlr_EwBZbCJmP0ufAcw',
			//       refresh_token: 'gHDN5wEBolyA_hM9YN3UQf9OLIX_ecOhNCg7-ExkeOg.y9xRVoUeaF0ZGB4Sn3P1vsN-QnGjhKyvcDWfKLATaf0',
			//       scope: 'openid offline',
			//       token_type: 'bearer'
			//     },
			//     profile: {
			//       id: '6c9199fc-a6ff-4402-9241-e5516f2037c8',
			//       at_hash: '-a0FY1bz4thdVWbR6zxDIA',
			//       aud: [Array],
			//       auth_time: 1668455007,
			//       email: 'testnewsignup@test.com',
			//       email_verified: false,
			//       exp: 1668458615,
			//       'https://auth.hashicorp.com/auth0/connection/id': 'con_XqZH31xVqDQyudOd',
			//       'https://auth.hashicorp.com/auth0/connection/name': 'Username-Password-Authentication',
			//       'https://auth.hashicorp.com/auth0/connection/strategy': 'auth0',
			//       'https://auth.hashicorp.com/connection': 'auth0',
			//       'https://auth.hashicorp.com/connection/id': 'con_XqZH31xVqDQyudOd',
			//       'https://auth.hashicorp.com/connection/name': 'Username-Password-Authentication',
			//       'https://auth.hashicorp.com/connection/strategy': 'auth0',
			//       'https://auth.hashicorp.com/idp': 'auth0',
			//       'https://auth.hashicorp.com/mfa_enabled': false,
			//       'https://auth.hashicorp.com/primary-identity-provider': 'auth0',
			//       'https://auth.hashicorp.com/sub': 'auth0|63729a5dd46f37e2ed8d5f73',
			//       iat: 1668455015,
			//       iss: 'https://auth.idp.hcp.dev/',
			//       jti: 'c435206f-841b-4675-a289-ae2cdad2908d',
			//       name: 'testnewsignup@test.com',
			//       nickname: 'testnewsignup',
			//       picture: 'https://s.gravatar.com/avatar/9cfdeb0406d3c60b2f470a01829a80a5?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fte.png',
			//       rat: 1668454988,
			//       sid: '3d3eaf50-bb35-44f7-a1b9-cde29b09790d',
			//       sub: '6c9199fc-a6ff-4402-9241-e5516f2037c8',
			//       updated_at: '2022-11-14T19:43:25.305Z'
			//     },
			//     isNewUser: undefined
			//   }
			// }
		},
		/**
		 * NOTE: NextAuth does not log out of auth providers, so we have to handle doing that
		 * ourselves in this signOut event.
		 * https://github.com/nextauthjs/next-auth/discussions/3938
		 */
		async signOut({ token }) {
			if (isDev) {
				console.log('Inside of NextAuth.events.signOut')
			}

			try {
				// Fetch the wellknown configuration
				const wellKnownConfiguration = await (
					await fetch(CloudIdpProvider.wellKnown)
				).json()

				// Pull the end_session_endpoint value
				const endSessionEndpoint = wellKnownConfiguration.end_session_endpoint

				// Construct the full URL to end the session
				const endSessionUrl = new URL(endSessionEndpoint)
				const idToken = (token as TokenSet).id_token
				endSessionUrl.searchParams.set('id_token_hint', idToken)

				// Fetch to hit the end session endpoint
				await fetch(endSessionUrl.toString())
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
					let errorType = AuthErrors.RefreshAccessTokenError

					if (err.error === 'token_inactive') {
						errorType = AuthErrors.RefreshAccessTokenExpiredError
					}

					console.error(`${errorType}: failed to refresh token set`, err)
					return {
						...token,
						error: errorType,
					}
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
