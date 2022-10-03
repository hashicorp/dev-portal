import { MouseEvent } from 'react'
import { useDisclosureState } from 'components/disclosure'
import Text from 'components/text'
import Link from 'next/link'
import {
	DropdownDisclosureButtonItemProps,
	DropdownDisclosureDescriptionItemProps,
	DropdownDisclosureLabelItemProps,
	DropdownDisclosureLinkItemProps,
	DropdownDisclosureListItemProps,
} from './types'
import s from './list-item.module.css'

/**
 * Wraps its content in an <li> element and applies the necessary styles. Only
 * intended for internal use by the rest of the item subcomponents.
 */
const DropdownDisclosureListItem = ({
	children,
}: DropdownDisclosureListItemProps) => {
	return <li className={s.root}>{children}</li>
}

/**
 * Renders an <hr> element with the necessary styles.
 */
const DropdownDisclosureSeparatorItem = () => {
	return (
		<DropdownDisclosureListItem>
			<hr className={s.separator} />
		</DropdownDisclosureListItem>
	)
}

/**
 * Renders text in a bold weight. Intended to be used for labeling either:
 * 	- All of a list's content
 * 	- A section of a list's content
 */
const DropdownDisclosureLabelItem = ({
	children,
}: DropdownDisclosureLabelItemProps) => {
	return (
		<DropdownDisclosureListItem>
			<Text asElement="span" className={s.label} size={100} weight="semibold">
				{children}
			</Text>
		</DropdownDisclosureListItem>
	)
}

/**
 * Renders text in a regular weight. Intended to be used for describing either:
 * 	- All of a list's content
 * 	- A section of a list's content
 */
const DropdownDisclosureDescriptionItem = ({
	children,
}: DropdownDisclosureDescriptionItemProps) => {
	return (
		<DropdownDisclosureListItem>
			<Text
				asElement="span"
				className={s.description}
				size={100}
				weight="regular"
			>
				{children}
			</Text>
		</DropdownDisclosureListItem>
	)
}

/**
 * An item that performs an action and does not navigate the user elsewhere.
 * Automatically closes the disclosure after invoking the `onClick` callback.
 */
const DropdownDisclosureButtonItem = ({
	children,
	icon,
	onClick,
}: DropdownDisclosureButtonItemProps) => {
	const { toggleDisclosure } = useDisclosureState()

	return (
		<DropdownDisclosureListItem>
			<button
				className={s.button}
				onClick={(event: MouseEvent<HTMLButtonElement>) => {
					onClick(event)
					toggleDisclosure()
				}}
			>
				{icon}
				<Text asElement="span" size={200} weight="medium">
					{children}
				</Text>
			</button>
		</DropdownDisclosureListItem>
	)
}

/**
 * An item that performs a navigation to the given `href`.
 */
const DropdownDisclosureLinkItem = ({
	children,
	href,
	icon,
	rel,
	target,
}: DropdownDisclosureLinkItemProps) => {
	return (
		<DropdownDisclosureListItem>
			<Link href={href}>
				<a className={s.link} rel={rel} target={target}>
					{icon}
					<Text asElement="span" size={200} weight="medium">
						{children}
					</Text>
				</a>
			</Link>
		</DropdownDisclosureListItem>
	)
}

export type {
	DropdownDisclosureButtonItemProps,
	DropdownDisclosureDescriptionItemProps,
	DropdownDisclosureLabelItemProps,
	DropdownDisclosureLinkItemProps,
	DropdownDisclosureListItemProps,
}
export {
	DropdownDisclosureButtonItem,
	DropdownDisclosureDescriptionItem,
	DropdownDisclosureLabelItem,
	DropdownDisclosureLinkItem,
	DropdownDisclosureSeparatorItem,
}
