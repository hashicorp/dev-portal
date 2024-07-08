/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import Link from 'components/link'
import { ButtonLinkProps } from './types'
import s from './button-link.module.css'

/**
 * _Note WIP Component_
 * this button link component should mimic the design system options
 * outlined in `Button` component. This is a WIP implementation and should be
 * expanded upon. It currently renders a theme colors and sizes, with styles
 * copied from `Button`.
 **/
const ButtonLink = ({
	'aria-label': ariaLabel,
	color = 'primary',
	href,
	icon,
	iconPosition = 'leading',
	opensInNewTab = false,
	size = 'medium',
	text,
	className,
	onClick,
}: ButtonLinkProps) => {
	const hasIcon = !!icon
	const hasText = !!text
	const hasLabel = !!ariaLabel
	const hasLeadingIcon = hasIcon && iconPosition === 'leading'
	const hasTrailingIcon = hasIcon && iconPosition === 'trailing'
	const isIconOnly = hasIcon && !hasText

	if (!hasIcon && !hasText) {
		throw new Error(
			'`ButtonLink` must have either `text` or an `icon` with accessible labels.'
		)
	}

	if (isIconOnly && !hasLabel) {
		throw new Error(
			'Icon-only `ButtonLink`s require an accessible label. Either provide the `text` prop, or `ariaLabel`.'
		)
	}

	return (
		<Link
			aria-label={ariaLabel}
			className={classNames(s.root, s[size], s[color], className)}
			href={href}
			onClick={onClick}
			opensInNewTab={opensInNewTab}
			rel={opensInNewTab ? 'noreferrer noopener' : undefined}
		>
			<>
				{hasLeadingIcon && icon}
				{hasText ? text : null}
				{hasTrailingIcon && icon}
			</>
		</Link>
	)
}

export default ButtonLink
