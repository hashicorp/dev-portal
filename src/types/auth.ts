export type SessionStatus = 'authenticated' | 'unauthenticated' | 'loading'

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
