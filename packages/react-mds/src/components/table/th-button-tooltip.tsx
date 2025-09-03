import { useId } from 'react'
import { Tooltip } from '../../hds/wrappers/tooltip'
import { FlightIcon } from '../flight-icon'
import s from './table.module.scss'

interface TooltipProps {
	tooltip: string
	labelId: string
}

export const ThButtonTooltip = ({ tooltip, labelId }: TooltipProps) => {
	const prefixLabelId = useId()

	return (
		<Tooltip text={tooltip}>
			<button
				type="button"
				className={s['th-button']}
				aria-labelledby={`${prefixLabelId} ${labelId}`}
			>
				<span id={prefixLabelId} className={s['aria-label-hidden-segment']}>
					More information for
				</span>
				<FlightIcon name="info" />
			</button>
		</Tooltip>
	)
}
