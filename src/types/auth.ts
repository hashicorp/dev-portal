import { Session } from 'next-auth'

/**
 * Object representing an authentication session.
 */
type SessionData = Omit<Session, 'user'> & {
	id?: 'string'
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
	Test = 'test-123',
}

export type { SessionData, UserData }
export { ValidAuthProviderId }
