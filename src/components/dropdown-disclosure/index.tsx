/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useEffect } from 'react'
import classNames from 'classnames'
import Disclosure, { DisclosureContent } from 'components/disclosure'
import { developmentToast, ToastColor } from 'components/toast'
import {
	DropdownDisclosureActivator,
	DropdownDisclosureAnchorItem,
	DropdownDisclosureButtonItem,
	DropdownDisclosureDescriptionItem,
	DropdownDisclosureLabelItem,
	DropdownDisclosureLinkItem,
	DropdownDisclosureListItem,
	DropdownDisclosureSeparatorItem,
} from './components'
import { DropdownDisclosureProps } from './types'
import { validateDropdownDisclosureChildren } from './helpers'
import s from './dropdown-disclosure.module.css'

/**
 * Logs an error message to the console, then renders a critical development
 * with the same message toast.
 */
const handleError = (message: string) => {
	console.error(message)
	developmentToast({
		color: ToastColor.critical,
		title: 'Error in DropdownDisclosure',
		description: message,
	})
}

const DropdownDisclosure = ({
	activatorClassName,
	'aria-label': ariaLabel,
	'aria-describedby': ariaDescribedBy,
	children,
	className,
	closeOnRouteChangeStart,
	color = 'primary',
	hideChevron = false,
	icon,
	listPosition = 'left',
	text,
	isFullWidth,
}: DropdownDisclosureProps) => {
	// Check if `children` are valid
	validateDropdownDisclosureChildren(children)

	// Check for invalid props
	useEffect(() => {
		const hasIcon = !!icon
		const hasText = !!text
		const hasLabel = !!ariaLabel
		const isIconOnly = hasIcon && !hasText
		const isTextOnly = !hasIcon && hasText

		if (hasIcon && hasText) {
			const message =
				'`DropdownDisclosure` does not accept both `icon` and `label`. Only provide one or the other.'
			handleError(message)
		}

		if (isIconOnly && !hasLabel) {
			const message =
				'Icon-only `DropdownDisclosure`s require an accessible label. Provide an `aria-label` or replace the `icon` prop with the `text` prop.'
			handleError(message)
		}

		if (isTextOnly && hideChevron) {
			const message =
				'`DropdownDisclosure`s with the `text` prop require `hideChevron` to be `false`.'
			handleError(message)
		}
	}, [ariaLabel, hideChevron, icon, text])

	return (
		<Disclosure
			closeOnEscapeKey
			closeOnClickOutside
			closeOnFocusOutside
			closeOnRouteChangeStart={closeOnRouteChangeStart}
			containerClassName={classNames(
				s.root,
				s[`list-position--${listPosition}`],
				isFullWidth && s['full-width'],
				className
			)}
		>
			<DropdownDisclosureActivator
				aria-label={ariaLabel}
				aria-describedby={ariaDescribedBy}
				className={classNames(
					s.activator,
					isFullWidth && s['full-width'],
					activatorClassName
				)}
				color={color}
				hideChevron={hideChevron}
			>
				{icon || text}
			</DropdownDisclosureActivator>
			<DisclosureContent
				className={classNames(s.content, isFullWidth && s['full-width'])}
			>
				<ul className={classNames(s.list, isFullWidth && s['full-width'])}>
					{children}
				</ul>
			</DisclosureContent>
		</Disclosure>
	)
}

export type { DropdownDisclosureProps }
export {
	DropdownDisclosureAnchorItem,
	DropdownDisclosureButtonItem,
	DropdownDisclosureDescriptionItem,
	DropdownDisclosureLabelItem,
	DropdownDisclosureLinkItem,
	DropdownDisclosureListItem,
	DropdownDisclosureSeparatorItem,
}
export default DropdownDisclosure
