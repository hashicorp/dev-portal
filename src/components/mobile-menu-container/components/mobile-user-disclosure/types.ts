/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { Session } from 'next-auth'
import { UserDropdownDisclosureItem } from 'components/user-dropdown-disclosure'

interface MobileUserDisclosureProps {
	items: UserDropdownDisclosureItem[]
	user: Session['user']
	initialOpen?: boolean
}

export type { MobileUserDisclosureProps }
