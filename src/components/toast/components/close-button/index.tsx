/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import { IconX16 } from '@hashicorp/flight-icons/svg-react/x-16'
import type { CloseButtonProps } from './types'
import s from './close-button.module.css'

/**
 * "X" button, for closing modals and toasts, for example.
 * Mostly duplicative of @hashicorp/react-close-button.
 */
export default function CloseButton({
	ariaLabel,
	className,
	onClick,
}: CloseButtonProps) {
	return (
		<button
			aria-label={ariaLabel}
			className={classNames(s.closeButton, className)}
			onClick={onClick}
		>
			<IconX16 />
		</button>
	)
}
