/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { IconUser24 } from '@hashicorp/flight-icons/svg-react/user-24'
import { getUserMeta } from 'lib/auth/user'
import isAbsoluteUrl from 'lib/is-absolute-url'
import DropdownDisclosure, {
	DropdownDisclosureButtonItem,
	DropdownDisclosureDescriptionItem,
	DropdownDisclosureLabelItem,
	DropdownDisclosureLinkItem,
	DropdownDisclosureSeparatorItem,
} from 'components/dropdown-disclosure'
import {
	UserDropdownDisclosureItem,
	UserDropdownDisclosureProps,
} from './types'

/**
 * Handles rendering either a link item or a button item based on whether the
 * `href` or `onClick` property is given.
 */
const renderItem = (
	{ href, icon, label, onClick }: UserDropdownDisclosureItem,
	itemIndex: number
) => {
	if (href) {
		const isExternal = isAbsoluteUrl(href)
		const rel = isExternal ? 'noreferrer noopener' : undefined
		const target = isExternal ? '_blank' : undefined

		return (
			<DropdownDisclosureLinkItem
				key={itemIndex}
				href={href}
				icon={icon}
				rel={rel}
				target={target}
			>
				{label}
			</DropdownDisclosureLinkItem>
		)
	}

	if (onClick) {
		return (
			<DropdownDisclosureButtonItem
				key={itemIndex}
				icon={icon}
				onClick={onClick}
			>
				{label}
			</DropdownDisclosureButtonItem>
		)
	}
}

/**
 * A DropdownDisclosure intended to be used as a menu with actions/links for
 * both authenticated and unauthenticated users.
 */
const UserDropdownDisclosure = ({
	className,
	items,
	listPosition,
	user,
}: UserDropdownDisclosureProps) => {
	let userMeta
	if (user) {
		userMeta = getUserMeta(user)
	}

	return (
		<DropdownDisclosure
			aria-label="User menu"
			className={className}
			icon={user ? userMeta.icon : <IconUser24 />}
			listPosition={listPosition}
		>
			{user ? (
				<>
					<DropdownDisclosureLabelItem>
						{userMeta.label}
					</DropdownDisclosureLabelItem>
					<DropdownDisclosureDescriptionItem>
						{userMeta.description}
					</DropdownDisclosureDescriptionItem>
					<DropdownDisclosureSeparatorItem />
				</>
			) : null}
			{items.map(renderItem)}
		</DropdownDisclosure>
	)
}

export type { UserDropdownDisclosureItem, UserDropdownDisclosureProps }
export default UserDropdownDisclosure
