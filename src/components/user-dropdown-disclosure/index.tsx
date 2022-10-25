import DropdownDisclosure, {
	DropdownDisclosureButtonItem,
	DropdownDisclosureDescriptionItem,
	DropdownDisclosureLabelItem,
	DropdownDisclosureLinkItem,
	DropdownDisclosureSeparatorItem,
} from 'components/dropdown-disclosure'
import { getUserMeta } from 'lib/auth/user'
import isAbsoluteUrl from 'lib/is-absolute-url'
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
 * authenticated users.
 */
const UserDropdownDisclosure = ({
	className,
	items,
	listPosition,
	user,
}: UserDropdownDisclosureProps) => {
	const { icon, label, description } = getUserMeta(user)

	return (
		<DropdownDisclosure
			aria-label="User menu"
			className={className}
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

export type { UserDropdownDisclosureItem, UserDropdownDisclosureProps }
export default UserDropdownDisclosure
