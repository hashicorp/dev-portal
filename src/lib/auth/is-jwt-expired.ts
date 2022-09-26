import { decode } from 'jsonwebtoken'

/**
 * Returns a tuple of the if the jwt is expired, and the number of seconds until expiry.
 * If expired, the number of seconds will be negative.
 */
export default function isJwtExpired(jwt: string) {
	const nowS = Date.now() / 1000
	const jwtPayload = decode(jwt, { json: true })
	if (!jwtPayload) {
		throw new Error('isJwtExpired failed to parse jwt')
	}
	const { exp } = jwtPayload
	return [nowS > exp, Math.floor(exp - nowS)] as const
}
