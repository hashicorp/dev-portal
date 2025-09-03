import type { AlertColor, AlertProps } from '../alert'
import { FlightIcon, FlightIconName } from '../flight-icon'
import s from './alert.module.scss'

const ICON_BY_COLOR_AND_TYPE = {
	neutral: {
		compact: 'info-fill',
		default: 'info',
	},
	highlight: {
		compact: 'info-fill',
		default: 'info',
	},
	success: {
		compact: 'check-circle-fill',
		default: 'check-circle',
	},
	warning: {
		compact: 'alert-triangle-fill',
		default: 'alert-triangle',
	},
	critical: {
		compact: 'alert-diamond-fill',
		default: 'alert-diamond',
	},
} as const satisfies Record<
	AlertColor,
	Record<'compact' | 'default', FlightIconName>
>

interface IconProps {
	icon?: FlightIconName | false
	color: AlertColor
	type: AlertProps['type']
}

const Icon = ({ icon, type, color }: IconProps) => {
	if (icon === false) {
		return null
	}

	const defaultIconName: FlightIconName =
		type === 'compact'
			? ICON_BY_COLOR_AND_TYPE[color].compact
			: ICON_BY_COLOR_AND_TYPE[color].default

	const iconName = icon ?? defaultIconName

	return (
		<div className={s.icon}>
			<FlightIcon name={iconName} stretched />
		</div>
	)
}

export { Icon }
