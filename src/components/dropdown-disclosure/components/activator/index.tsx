/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import { IconChevronDown16 } from '@hashicorp/flight-icons/svg-react/chevron-down-16'
import Button from 'components/button'
import { useDisclosureState } from 'components/disclosure'
import disclosureStyles from 'components/disclosure/disclosure.module.css'
import { DropdownDisclosureActivatorProps } from './types'
import s from './activator.module.css'

const DropdownDisclosureActivator = ({
	'aria-label': ariaLabel,
	'aria-describedby': ariaDescribedBy,
	children,
	className,
	color = 'primary',
	hideChevron = false,
}: DropdownDisclosureActivatorProps) => {
	const { contentContainerId, isOpen, toggleDisclosure } = useDisclosureState()

	const hasIcon = typeof children !== 'string'
	const isIconOnly = hasIcon && hideChevron
	const classes = classNames(disclosureStyles.activator, s.root, className, {
		[s.hasIcon]: hasIcon,
	})
	const buttonProps = {
		'aria-controls': contentContainerId,
		'aria-expanded': isOpen,
		'aria-label': ariaLabel,
		'aria-describedby': ariaDescribedBy,
		className: classes,
		onClick: toggleDisclosure,
	}

	if (typeof children === 'string') {
		return (
			<Button
				{...buttonProps}
				color={color}
				icon={
					hideChevron ? null : (
						<IconChevronDown16 className={s.chevronWrapper} />
					)
				}
				iconPosition={hideChevron ? undefined : 'trailing'}
				text={children}
			/>
		)
	} else {
		return (
			<button {...buttonProps}>
				<span className={s.childrenWrapper}>{children}</span>
				{!isIconOnly && (
					<span className={s.chevronWrapper}>
						<IconChevronDown16 />
					</span>
				)}
			</button>
		)
	}
}

export type { DropdownDisclosureActivatorProps }
export default DropdownDisclosureActivator
