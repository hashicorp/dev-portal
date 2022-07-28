import { UserData } from 'types/auth'

interface ProfileViewProps {
	/**
	 * An object reprensenting the user to show profile data for.
	 */
	user: UserData

	// TODO: type this
	bookmarks: any
}

export type { ProfileViewProps }
