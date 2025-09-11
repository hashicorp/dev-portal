import { useEffect, useRef, useState } from 'react'
import { animated } from '@react-spring/web'
import { ComputedDatum, DefaultRawDatum } from '@nivo/pie'
import { ArcLabelComponent } from '@nivo/arcs'
import classNames from 'classnames'
import s from './styles.module.css'
import { getContrastYIQ, hexToRgb } from '../../../../../utils/get-contrast-yiq'

export const useRenderArcLabelComponent: typeof ArcLabelComponent<
	ComputedDatum<DefaultRawDatum>
> = (d) => {
	const labelRef = useRef<HTMLDivElement>(null)
	const [foreignObjectWidth, setForeignObjectWidth] = useState(0)
	const [foreignObjectHeight, setForeignObjectHeight] = useState(0)

	useEffect(() => {
		if (labelRef.current) {
			setForeignObjectWidth(labelRef.current.offsetWidth)
			setForeignObjectHeight(labelRef.current.offsetHeight)
		}
	}, [])

	const textColor = getContrastYIQ(hexToRgb(d.datum.color))
	return (
		<>
			<path />
			<animated.g transform={d.style.transform} opacity={d.style.progress}>
				<g
					className={s.container}
					style={{
						['--container-width' as string]: `${foreignObjectWidth}px`,
						['--container-height' as string]: `${foreignObjectHeight}px`,
					}}
				>
					<animated.foreignObject
						width={foreignObjectWidth}
						height={foreignObjectHeight}
					>
						<div className={classNames(s.label, s[textColor])}>
							<div ref={labelRef}>{d.datum.value}%</div>
						</div>
					</animated.foreignObject>
				</g>
			</animated.g>
		</>
	)
}
