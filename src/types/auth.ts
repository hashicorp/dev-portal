import { Session } from 'next-auth'
import { JWT } from 'next-auth/jwt'

/**
 * Object representing an authentication session.
 */
type SessionData = Omit<Session, 'user'> & {
	accessToken?: string
	id?: string
	error?: AuthErrors
}

/**
 * Object representing an authenticated user.
 */
type UserData = Session['user'] & {
	nickname?: string | null
}

/**
 * Enumeration of supported auth provider IDs.
 */
enum ValidAuthProviderId {
	CloudIdp = 'cloud-idp',
}

export type { SessionData, UserData }
export { ValidAuthProviderId }

export enum AuthErrors {
	// NOTE: temporary prefix of [next-auth] for existing log monitor
	// TODO: abstract logging so everything is grouped
	RefreshAccessTokenError = '[next-auth] RefreshAccessTokenError',
	RefreshAccessTokenExpiredError = '[next-auth] RefreshAccessTokenError: inactive_token',
}

/** The response shape from `POST {IDENTITY_PROVIDER}/oauth2/token` */
export interface TokenSet extends JWT {
	access_token: string
	refresh_token: string
	scope: string
	expires_in: number
	id_token: string
	token_type: 'bearer'
}
