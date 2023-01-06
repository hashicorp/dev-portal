import classNames from 'classnames'

import { IconInfo24 } from '@hashicorp/flight-icons/svg-react/info-24'
import { IconAlertTriangle24 } from '@hashicorp/flight-icons/svg-react/alert-triangle-24'
import { IconAlertDiamond24 } from '@hashicorp/flight-icons/svg-react/alert-diamond-24'

import { AlertProps, AlertData } from './types'
import s from './alert.module.css'

const ALERT_DATA: AlertData = {
	tip: { title: 'Tip', icon: <IconInfo24 /> },
	highlight: { title: 'Tip', icon: <IconInfo24 /> },
	note: { title: 'Note', icon: <IconAlertTriangle24 /> },
	warning: { title: 'Warning', icon: <IconAlertDiamond24 /> },
}

export default function Alert({ children, type = 'tip', title }: AlertProps) {
	const data = ALERT_DATA[type]

	if (!children) {
		throw new Error(
			'[Alert]: No `children` found, please pass a description body'
		)
	}

	if (!data) {
		throw new Error(
			'[Alert]: Invalid alert type passed. Please pass one of: tip | highlight | note | warning'
		)
	}

	return (
		<div className={classNames(s.default, s[type])}>
			<span className={s.icon} data-testid="icon">
				{data.icon}
			</span>
			<span className={s.content}>
				<p className={s.title}>{title ?? data.title}</p>
				<span className={s.body}>{children}</span>
			</span>
		</div>
	)
}

export type { AlertProps }
