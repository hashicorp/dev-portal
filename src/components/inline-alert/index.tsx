import classNames from 'classnames'
import { IconInfo24 } from '@hashicorp/flight-icons/svg-react/info-24'
import { InlineAlertProps } from './types'
import s from './inline-alert.module.css'

export default function InlineAlert({
	color = 'neutral',
	description,
	icon,
	title,
}: InlineAlertProps) {
	return (
		<div className={classNames(s.default, s[color])}>
			<span className={s.icon} data-testid="icon">
				{icon ?? <IconInfo24 />}
			</span>
			<span className={s.content}>
				<p className={s.title}>{title}</p>
				<span className={s.description}>{description}</span>
			</span>
		</div>
	)
}

export type { InlineAlertProps }
