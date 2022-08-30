import { UserData } from 'types/auth'
import { UserDropdownDisclosureItem } from 'components/user-dropdown-disclosure'

interface MobileUserDisclosureProps {
	items: UserDropdownDisclosureItem[]
	user: UserData
	initialOpen?: boolean
}

export type { MobileUserDisclosureProps }
