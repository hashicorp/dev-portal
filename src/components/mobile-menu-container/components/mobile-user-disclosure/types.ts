import { Session } from 'next-auth'
import { UserDropdownDisclosureItem } from 'components/user-dropdown-disclosure'

interface MobileUserDisclosureProps {
	items: UserDropdownDisclosureItem[]
	user: Session['user']
	initialOpen?: boolean
}

export type { MobileUserDisclosureProps }
