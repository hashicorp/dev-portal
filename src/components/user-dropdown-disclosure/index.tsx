/* eslint-disable @next/next/no-img-element */
import { IconUser24 } from '@hashicorp/flight-icons/svg-react/user-24'
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
const renderItem = ({
	href,
	icon,
	label,
	onClick,
}: UserDropdownDisclosureItem) => {
	if (href) {
		return (
			<DropdownDisclosureLinkItem href={href} icon={icon}>
				{label}
			</DropdownDisclosureLinkItem>
		)
	}

	if (onClick) {
		return (
			<DropdownDisclosureButtonItem icon={icon} onClick={onClick}>
				{label}
			</DropdownDisclosureButtonItem>
		)
	}
}

/**
 * A DropdownDisclosure intended to be used as a menu with actions/links for
 * authenticated users.
 */
const UserDropdownDisclosure = ({
	items,
	listPosition,
	user,
}: UserDropdownDisclosureProps) => {
	const icon = user.image ? <img alt="" src={user.image} /> : <IconUser24 />
	const isSignedInWithGitHub = user.image?.includes('github')
	const description = isSignedInWithGitHub ? user.nickname : user.email
	const label = `Signed in with ${isSignedInWithGitHub ? 'GitHub' : 'Email'}`

	return (
		<DropdownDisclosure
			aria-label="User menu"
			icon={icon}
			listPosition={listPosition}
		>
			<DropdownDisclosureLabelItem>{label}</DropdownDisclosureLabelItem>
			<DropdownDisclosureDescriptionItem>
				{description}
			</DropdownDisclosureDescriptionItem>
			<DropdownDisclosureSeparatorItem />
			{items.map(renderItem)}
		</DropdownDisclosure>
	)
}

export default UserDropdownDisclosure
