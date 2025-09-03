import { FC } from 'react'
import { DefaultRawDatum, PieTooltipProps } from '@nivo/pie'
import s from './styles.module.css'

export const renderArcTooltip: FC<PieTooltipProps<DefaultRawDatum>> = (d) => (
	<div className={s.container}>
		<div className={s.label}>
			{d.datum.label}: <strong>{d.datum.value}%</strong>
		</div>
	</div>
)
