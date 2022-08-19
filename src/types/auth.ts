import { Session } from 'next-auth'

/**
 * Object representing an authentication session.
 */
type SessionData = Omit<Session, 'user'> & {
	accessToken?: string
	id?: string
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
