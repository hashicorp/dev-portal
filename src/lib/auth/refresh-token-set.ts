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
 * Takes a refresh token, and returns a refreshed tokenSet.
 *
 * Adapted from: https://next-auth.js.org/tutorials/refresh-token-rotation#server-side
 */
export default async function refreshTokenSet(
	refreshToken: string
): Promise<TokenSet> {
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
				refresh_token: refreshToken as string,
			}),
		})

		const refreshedTokenset: TokenSet = await response.json()

		if (!response.ok) {
			throw refreshedTokenset
		}

		return refreshedTokenset
	} catch (error) {
		console.log('refreshTokenSet error', error)
		throw error
	}
}
