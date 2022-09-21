import type { JWT } from 'next-auth/jwt'

// The response shape from
// POST {IDENTITY_PROVIDER}/oauth2/token
interface TokenSet {
	access_token: string
	refresh_token: string
	scope: string
	expires_in: number
	id_token: string
	token_type: 'bearer'
}

/**
 * Takes a tokenSet, and returns a refreshed tokenSet.
 * If an error occurs, returns the old tokenSet and an error property
 *
 * Adapted from: https://next-auth.js.org/tutorials/refresh-token-rotation#server-side
 */
export default async function refreshTokenSet(tokenSet: JWT): Promise<JWT> {
	const { refresh_token } = tokenSet

	try {
		const url = new URL('/oauth2/token', __config.dev_dot.auth.idp_url)
		const response = await fetch(url.toString(), {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			method: 'POST',
			body: new URLSearchParams({
				client_id: process.env.AUTH_CLIENT_ID,
				client_secret: process.env.AUTH_CLIENT_SECRET,
				grant_type: 'refresh_token',
				refresh_token: refresh_token as string,
			}),
		})

		const refreshedTokenset: TokenSet = await response.json()

		if (!response.ok) {
			throw refreshedTokenset
		}

		return {
			...tokenSet,
			...refreshedTokenset,
		}
	} catch (error) {
		console.log('refreshTokenSet error', error)

		return {
			...tokenSet,
			error: 'RefreshAccessTokenError',
		}
	}
}
