/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { MouseEvent } from 'react'
import classNames from 'classnames'
import { useDisclosureState } from 'components/disclosure'
import Link from 'components/link'
import Text from 'components/text'
import {
	DropdownDisclosureButtonItemProps,
	DropdownDisclosureDescriptionItemProps,
	DropdownDisclosureLabelItemProps,
	DropdownDisclosureLinkItemProps,
	DropdownDisclosureListItemProps,
} from './types'
import s from './list-item.module.css'

/**
 * Wraps its content in an <li> element and applies the necessary styles.
 */
const DropdownDisclosureListItem = ({
	className,
	children,
}: DropdownDisclosureListItemProps) => {
	return <li className={classNames(s.root, className)}>{children}</li>
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
				className={classNames('ph-no-capture', s.description)}
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
				<Text asElement="span" size={200} weight="medium">
					{children}
				</Text>
				{icon}
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
	onClick,
}: DropdownDisclosureLinkItemProps) => {
	return (
		<DropdownDisclosureListItem>
			<Link
				className={s.link}
				href={href}
				rel={rel}
				target={target}
				onClick={onClick}
			>
				<Text asElement="span" size={200} weight="medium">
					{children}
				</Text>
				{icon}
			</Link>
		</DropdownDisclosureListItem>
	)
}

/*
 * This component provides a temporary workaround using an anchor tag
 * instead of 'link' component. There has been an issue observed where
 * 404 links throw uncaught error pages with the version switcher drpodown
 */
const DropdownDisclosureAnchorItem = ({
	children,
	href,
	icon,
	rel,
	target,
}: DropdownDisclosureLinkItemProps) => {
	return (
		<DropdownDisclosureListItem>
			<a className={s.link} href={href} rel={rel} target={target}>
				{icon}
				<Text asElement="span" size={200} weight="medium">
					{children}
				</Text>
			</a>
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
	DropdownDisclosureAnchorItem,
	DropdownDisclosureButtonItem,
	DropdownDisclosureDescriptionItem,
	DropdownDisclosureLabelItem,
	DropdownDisclosureLinkItem,
	DropdownDisclosureSeparatorItem,
	DropdownDisclosureListItem,
}
