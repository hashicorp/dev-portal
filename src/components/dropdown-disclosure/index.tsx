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
import s from './dropdown-disclosure.module.css'

const DropdownDisclosure = ({
	'aria-label': ariaLabel,
	children,
	className,
	color = 'primary',
	hideChevron = false,
	icon,
	label,
	listPosition = 'left',
}: DropdownDisclosureProps) => {
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
				{label || icon}
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
