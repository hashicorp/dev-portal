import { Profile as NextAuthProfile } from 'next-auth'
import { JWT } from 'next-auth/jwt'

export type SessionStatus = 'authenticated' | 'unauthenticated' | 'loading'

export interface Profile extends NextAuthProfile {
	picture: string
	nickname: string
}

/**
 * Enumeration of supported auth provider IDs.
 */
export enum ValidAuthProviderId {
	CloudIdp = 'cloud-idp',
}

export enum AuthErrors {
	// NOTE: temporary prefix of [next-auth] for existing log monitor
	// TODO: abstract logging so everything is grouped
	RefreshAccessTokenError = '[next-auth] RefreshAccessTokenError',
	RefreshAccessTokenExpiredError = '[next-auth] RefreshAccessTokenError: token_inactive',
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
