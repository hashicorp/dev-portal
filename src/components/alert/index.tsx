import { IconInfo16 } from '@hashicorp/flight-icons/svg-react/info-16'
import { IconAlertTriangle16 } from '@hashicorp/flight-icons/svg-react/alert-triangle-16'
import { IconAlertDiamond16 } from '@hashicorp/flight-icons/svg-react/alert-diamond-16'
import s from './alert.module.css'

interface AlertProps {
	children: string
	type: 'tip' | 'highlight' | 'note' | 'warning'
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

	if (!data) {
		console.error('[MdxAlert]: No valid alert type found')
		return null
	}

	return (
		<div className={s.default}>
			<data.icon />
			<p>{title ?? data.title}</p>
			{children}
		</div>
	)
}
