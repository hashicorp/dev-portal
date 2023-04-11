/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Session } from 'next-auth'
import {
	DropdownDisclosureButtonItemProps,
	DropdownDisclosureLinkItemProps,
} from 'components/dropdown-disclosure/components/list-item'
import { DropdownDisclosureProps } from 'components/dropdown-disclosure'

type UserDropdownDisclosureItem =
	| {
			icon?: DropdownDisclosureLinkItemProps['icon']
			href: DropdownDisclosureLinkItemProps['href']
			label: DropdownDisclosureLinkItemProps['children']
			onClick?: never
	  }
	| {
			icon?: DropdownDisclosureButtonItemProps['icon']
			href?: never
			label: DropdownDisclosureButtonItemProps['children']
			onClick: DropdownDisclosureButtonItemProps['onClick']
	  }

type PickedDropdownDisclosureProps = Pick<
	DropdownDisclosureProps,
	'activatorClassName' | 'className' | 'listPosition'
>

interface UserDropdownDisclosureProps extends PickedDropdownDisclosureProps {
	items: UserDropdownDisclosureItem[]
	user: Session['user']
}

export type { UserDropdownDisclosureItem, UserDropdownDisclosureProps }
