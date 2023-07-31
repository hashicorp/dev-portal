import { jwtVerify, decodeJwt, createRemoteJWKSet, type JWTPayload } from 'jose'

/** Vercel/Next.js edge-runtime compliant JWT validation */
export default async function validateJWT(jwt: string) {
	if (!jwt) {
		return null
	}

	// decode the JWT. This will eventually get returned by this function
	const payload = decodeJwt(jwt)
	// get issuer from the JWT to construct the jwks endpoint
	const iss = payload.iss

	const jwksUri = new URL('.well-known/jwks.json', iss)
	const JWKS = createRemoteJWKSet(jwksUri)
	await jwtVerify(jwt, JWKS)
	return payload
}
