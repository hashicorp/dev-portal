/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { JWT } from 'next-auth/jwt'

/**
 * Takes a refresh token, and returns a refreshed tokenSet.
 *
 * Adapted from: https://next-auth.js.org/tutorials/refresh-token-rotation#server-side
 */
export default async function refreshTokenSet(
	refreshToken: string
): Promise<JWT> {
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
				refresh_token: refreshToken,
			}),
		})

		const refreshedTokenset = await response.json()

		if (!response.ok) {
			throw refreshedTokenset
		}

		return refreshedTokenset
	} catch (error) {
		console.log('refreshTokenSet error', error)
		throw error
	}
}
