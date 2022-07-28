import { Session } from 'next-auth'
import { Provider } from 'next-auth/providers'

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
}

/**
 * The next-auth Provider type with some additional custom properties.
 */
type AuthProvider = Provider & {
	accountSettingsUrl: string
}

export type { AuthProvider, SessionData, UserData }
export { ValidAuthProviderId }
