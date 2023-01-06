import classNames from 'classnames'

import { IconInfo16 } from '@hashicorp/flight-icons/svg-react/info-16'
import { IconAlertTriangle16 } from '@hashicorp/flight-icons/svg-react/alert-triangle-16'
import { IconAlertDiamond16 } from '@hashicorp/flight-icons/svg-react/alert-diamond-16'

import { AlertProps, AlertData } from './types'
import s from './alert.module.css'

const ALERT_DATA: AlertData = {
	tip: { title: 'Tip', icon: <IconInfo16 /> },
	highlight: { title: 'Tip', icon: <IconInfo16 /> },
	note: { title: 'Note', icon: <IconAlertTriangle16 /> },
	warning: { title: 'Warning', icon: <IconAlertDiamond16 /> },
}

export default function Alert({ children, type = 'tip', title }: AlertProps) {
	const data = ALERT_DATA[type]

	if (!children) {
		throw new Error(
			'[MdxAlert]: No `children` found, please pass a description body'
		)
	}

	if (!data) {
		throw new Error('[MdxAlert]: No valid alert type found')
	}

	return (
		<div className={classNames(s.default, s[type])}>
			<span className={s.icon}> {data.icon}</span>
			<span className={s.content}>
				<p className={s.title}>{title ?? data.title}</p>
				<span className={s.body}>{children}</span>
			</span>
		</div>
	)
}

export type { AlertProps }
