import { JWT } from 'next-auth/jwt'

// TODO: validate that the refresh token flow works as implemented

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 *
 * Adapted from: https://next-auth.js.org/tutorials/refresh-token-rotation#server-side
 */
export default async function refreshAccessToken(token: JWT) {
	try {
		const url =
			__config.dev_dot.auth.idp_url +
			'/oauth2/token?' +
			new URLSearchParams({
				client_id: process.env.AUTH_CLIENT_ID,
				client_secret: process.env.AUTH_CLIENT_SECRET,
				grant_type: 'refresh_token',
				refresh_token: token.refreshToken as string,
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
