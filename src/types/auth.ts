import { Session } from 'next-auth'

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
	RefreshAccessTokenError = 'RefreshAccessTokenError',
}

/** The response shape from `POST {IDENTITY_PROVIDER}/oauth2/token` */
export interface TokenSet {
	access_token: string
	refresh_token: string
	scope: string
	expires_in: number
	id_token: string
	token_type: 'bearer'
}
