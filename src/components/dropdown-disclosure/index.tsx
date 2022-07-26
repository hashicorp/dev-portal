import classNames from 'classnames'
import Disclosure, { DisclosureContent } from 'components/disclosure'
import {
	DropdownDisclosureActivator,
	DropdownDisclosureButtonItem,
	DropdownDisclosureDescriptionItem,
	DropdownDisclosureLabelItem,
	DropdownDisclosureLinkItem,
	DropdownDisclosureSeparatorItem,
} from './components'
import { DropdownDisclosureProps } from './types'
import { validateDropdownDisclosureChildren } from './helpers'
import s from './dropdown-disclosure.module.css'

const DropdownDisclosure = ({
	'aria-label': ariaLabel,
	children,
	className,
	color = 'primary',
	hideChevron = false,
	icon,
	text,
	listPosition = 'left',
}: DropdownDisclosureProps) => {
	// Check if `children` are valid
	validateDropdownDisclosureChildren(children)

	// Check for invalid props
	const hasIcon = !!icon
	const hasText = !!text
	const hasLabel = !!ariaLabel
	const isIconOnly = hasIcon && !hasText
	const isTextOnly = !hasIcon && hasText

	if (hasIcon && hasText) {
		throw new Error(
			'`DropdownDisclosure` does not accept both `icon` and `label`. Only provide one or the other.'
		)
	}

	if (isIconOnly && !hasLabel) {
		throw new Error(
			'Icon-only `DropdownDisclosure`s require an accessible label. Provide an `aria-label` or replace the `icon` prop with the `text` prop.'
		)
	}

	if (isTextOnly && hideChevron) {
		throw new Error(
			'`DropdownDisclosure`s with the `text` prop require `hideChevron` to be `false`.'
		)
	}

	return (
		<Disclosure
			closeOnEscapeKey
			closeOnClickOutside
			closeOnFocusOutside
			containerClassName={classNames(
				s.root,
				s[`list-position--${listPosition}`],
				className
			)}
		>
			<DropdownDisclosureActivator
				aria-label={ariaLabel}
				className={s.activator}
				color={color}
				hideChevron={hideChevron}
			>
				{icon || text}
			</DropdownDisclosureActivator>
			<DisclosureContent className={s.content}>
				<ul className={s.list}>{children}</ul>
			</DisclosureContent>
		</Disclosure>
	)
}

export type { DropdownDisclosureProps }
export {
	DropdownDisclosureButtonItem,
	DropdownDisclosureDescriptionItem,
	DropdownDisclosureLabelItem,
	DropdownDisclosureLinkItem,
	DropdownDisclosureSeparatorItem,
}
export default DropdownDisclosure
