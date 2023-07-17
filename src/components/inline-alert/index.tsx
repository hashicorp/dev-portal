/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import { IconInfo24 } from '@hashicorp/flight-icons/svg-react/info-24'
import { InlineAlertProps } from './types'
import s from './inline-alert.module.css'

export default function InlineAlert({
	className,
	color = 'neutral',
	description,
	icon = <IconInfo24 />,
	title,
	ctaSlot,
}: InlineAlertProps) {
	return (
		<div className={classNames(s.default, s[color], className)}>
			<span className={s.icon} data-testid="icon">
				{icon}
			</span>
			<span className={s.content}>
				<p className={s.title}>{title}</p>
				<span className={s.description}>{description}</span>
				{ctaSlot ? <span className={s.ctaSlot}>{ctaSlot}</span> : null}
			</span>
		</div>
	)
}

export type { InlineAlertProps }
