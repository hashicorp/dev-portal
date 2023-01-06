import { ReactChild } from 'react'
import { IconInfo16 } from '@hashicorp/flight-icons/svg-react/info-16'
import { IconAlertTriangle16 } from '@hashicorp/flight-icons/svg-react/alert-triangle-16'
import { IconAlertDiamond16 } from '@hashicorp/flight-icons/svg-react/alert-diamond-16'
import s from './alert.module.css'
import classNames from 'classnames'

export interface AlertProps {
	children: ReactChild | ReactChild[]
	type?: 'tip' | 'highlight' | 'note' | 'warning'
	title?: string
}

const AlertData = {
	tip: { title: 'Tip', icon: IconInfo16 },
	highlight: { title: 'Tip', icon: IconInfo16 },
	note: { title: 'Note', icon: IconAlertTriangle16 },
	warning: { title: 'Warning', icon: IconAlertDiamond16 },
}

export default function Alert({ children, type = 'tip', title }: AlertProps) {
	const data = AlertData[type]

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
			<data.icon className={s.icon} />
			<span className={s.content}>
				<p className={s.title}>{title ?? data.title}</p>
				<span className={s.body}>{children}</span>
			</span>
		</div>
	)
}
